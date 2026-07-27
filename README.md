# SANA-Streaming: Real-time Streaming Video Editing with Hybrid Diffusion Transformer

## 🎬 Video Demo

**[▶ Open the browser-based video demo](https://anonymous.4open.science/w/neurips_submission_10192/)**

## 📽️ About SANA-Streaming

**SANA-Streaming** is a real-time video-to-video editing system for minute-level,
high-resolution editing. Given a source video and a text instruction, it edits
the requested content while preserving source motion and non-edited regions.

Core contributions:

- **Hybrid Diffusion Transformer** — interleaves Gated DeltaNet (GDN) blocks with
  softmax-attention blocks, combining compact long-range memory with local
  source alignment.
- **Streaming Video Editing** — processes long videos with state caching and
  chunk-wise generation instead of full-sequence attention.
- **Cycle-Reverse Regularization** — improves temporal consistency by training
  the model to reconstruct source frames from edited content through flow
  matching.
- **Efficient System Co-design** — the paper reports fused GDN kernels and
  Mixed-Precision Quantization (MPQ) for consumer-GPU deployment, reaching
  1280×704 real-time editing at 24 end-to-end FPS and 58 DiT FPS.

This repository is used for NeurIPS 2026 review, with all the training and inference code, but the model weights will be released to public later.

## ⚙️ Environment Setup

```bash
bash ./environment_setup.sh sana-streaming
conda activate sana-streaming
```

The released V2V checkpoints were validated with `torch==2.10.0`,
`torchvision==0.25.0`, `triton==3.6.0`, `transformers==4.57.1`,
`accelerate==1.0.1`, and Hugging Face `diffusers` commit
`fbe8a75ad59fe5c0eec7f3691d2eb0ed890a0c90`. The fused GDN kernels and the
LTX-2 VAE path are sensitive to runtime package versions; use the pinned
package versions in `pyproject.toml` for reproducible bidirectional inference.

## Bidirectional V2V Training

This release includes bidirectional short-video V2V flow matching and the final
long-video fine-tuning stage.

The public path reuses the existing video trainer and released V2V model:

- trainer: `train_video_scripts/train_video_ivjoint_chunk.py`
- paired loader: `diffusion/data/datasets/video/sana_v2v_pair_data.py`
- recipe: `configs/sana_streaming/train/sana_streaming_bidirectional_2b_720p.yaml`

Train script:

```bash
torchrun --nproc_per_node=8 --master_port=29500 \
  train_video_scripts/train_video_ivjoint_chunk.py \
  --config_path=configs/sana_streaming/train/sana_streaming_bidirectional_2b_720p.yaml
```

## Long V2V Training

### Train the 441 stage

Place the 441-frame manifest under `data/sana_streaming_long_441`, then:

```bash
DISABLE_XFORMERS=1 torchrun --nproc_per_node=8 --master_port=29500 \
  train_video_scripts/train_longsana.py \
  --config_path configs/sana_streaming/train/sana_streaming_long_441_2b_720p.yaml \
  --logdir output/sana_streaming_long_441_2b_720p \
  --disable-wandb \
  --max_iters 5000
```

### Continue with the 969 stage

Place the 969-frame manifest under `data/sana_streaming_long_969`, then continue
from the 441-stage step-5000 checkpoint:

```bash
DISABLE_XFORMERS=1 torchrun --nproc_per_node=8 --master_port=29500 \
  train_video_scripts/train_longsana.py \
  --config_path configs/sana_streaming/train/sana_streaming_long_969_2b_720p.yaml \
  --logdir output/sana_streaming_long_969_2b_720p \
  --disable-wandb \
  --max_iters 10000
```

## Inference

### Streaming long-video editing

The streaming model edits 969 frames by default with 4 denoising steps,
`cfg_scale=1.0`, `num_cached_blocks=2`, and sink-token caching enabled.

```bash
python inference_video_scripts/v2v/inference_sana_streaming.py \
  --mode long_streaming \
  --config configs/sana_streaming/sana_streaming_2b_720p.yaml \
  --model_path /path/to/hf/model/dit/sana_streaming_ar.pth \
  --prompt "Transform the entire scene into a breathtaking Sci-Fi Art digital painting." \
  --video_path /path/to/source_videos/09_style_transfer_source.mp4 \
  --num_frames 969 \
  --step 4 \
  --cfg_scale 1.0 \
  --num_cached_blocks 2 \
  --sink_token true \
  --output_dir results/sana_streaming_long \
  --output_name output.mp4
```

### Bidirectional short-video editing

The bidirectional model edits 81 frames by default with flow-DPM solver sampling,
50 denoising steps, and `cfg_scale=6.0`. A default negative prompt is applied
unless `--negative_prompt` is provided.

```bash
python inference_video_scripts/v2v/inference_sana_streaming.py \
  --mode bidirectional_short \
  --config configs/sana_streaming/sana_streaming_bidirectional_2b_720p.yaml \
  --model_path /path/to/hf/model/dit/sana_bidirectional_short.pth \
  --prompt "Remove the thick, textured gold hoop earrings from the woman's ears. Carefully reconstruct the exposed earlobes to match her natural skin tone and texture. Ensure the lighting and soft shadows on the newly bare ears blend seamlessly with the rest of her face, leaving no trace or reflection of the metallic jewelry behind." \
  --video_path /path/to/source_videos/00_local_editing_source.mp4 \
  --num_frames 81 \
  --step 50 \
  --cfg_scale 6.0 \
  --output_dir results/sana_streaming_bidirectional \
  --output_name output.mp4
```
