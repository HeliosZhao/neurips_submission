const root = document.getElementById("app");

const base = "./assets/media/";
const useBlobVideoLoader =
  window.location.hostname === "anonymous.4open.science" &&
  window.location.pathname.startsWith("/w/");
const videoBlobUrls = new Map();

const rebuttalSections = [
  {
    id: "two-minute-video",
    title: "2-min Video",
    items: [
      {
        source: `rebuttal/two-minute/000120_source.mp4`,
        edit: `rebuttal/two-minute/000120_edit.mp4`,
        prompt: `Replace the background with a bright, modern home office space.`,
        mediaAspect: "1280 / 704"
      }
    ]
  },
  {
    id: "failure-cases",
    title: "Failure Cases",
    items: [
      {
        source: `rebuttal/failure-cases/000183_source.mp4`,
        edit: `rebuttal/failure-cases/000183_edit.mp4`,
        prompt: `Replace the background with a gritty, dimly lit underground subway corridor at night.`,
        mediaAspect: "1280 / 704"
      },
      {
        source: `rebuttal/reverse-examples/000046_source.mp4`,
        edit: `rebuttal/reverse-examples/000046_edit.mp4`,
        prompt: `Place a small, dark glass bottle on the left armrest of the white leather chair.`,
        mediaAspect: "1280 / 704"
      },
      {
        source: `rebuttal/failure-cases/000002_source.mp4`,
        edit: `rebuttal/failure-cases/000002_edit.mp4`,
        prompt: `Remove the floating glass vase with the single red flower hanging on the left side of the scene, allowing the out-of-focus green foliage to seamlessly fill the space behind it.`,
        mediaAspect: "1280 / 704"
      },
      {
        source: `rebuttal/failure-cases/000062_source.mp4`,
        edit: `rebuttal/failure-cases/000062_edit.mp4`,
        prompt: `Replace the silver wavy ring on the subject's index finger with a polished silver band featuring a prominent, square-cut green emerald.`,
        mediaAspect: "1280 / 704"
      }
    ]
  },
  {
    id: "large-motion",
    title: "Large Motion Examples",
    items: [
      {
        source: `rebuttal/large-motion/000057_source.mp4`,
        edit: `rebuttal/large-motion/000057_edit.mp4`,
        prompt: `Replace the background with a vast, rolling lavender field during a cinematic golden hour.`,
        mediaAspect: "1280 / 704"
      },
      {
        source: `rebuttal/large-motion/000388_source.mp4`,
        edit: `rebuttal/large-motion/000388_edit.mp4`,
        prompt: `Transform the existing urban street environment into a cinematic, rain-drenched futuristic city at night.`,
        mediaAspect: "1280 / 704"
      }
    ]
  },
  {
    id: "reverse-examples",
    title: "Reverse Examples",
    items: [
      {
        source: `rebuttal/reverse-examples/000093_source.mp4`,
        edit: `rebuttal/reverse-examples/000093_edit.mp4`,
        reverse: `rebuttal/reverse-examples/000093_reverse.mp4`,
        prompt: `Transform the entire video into a Cubist painting, utilizing geometric fragmentation and interlocking faceted planes.`,
        reversePrompt: `Transform the video into a photorealistic scene featuring a woman sitting by a calm lake with distant mountains.`,
        mediaAspect: "1280 / 704"
      },
      {
        source: `rebuttal/reverse-examples/000220_source.mp4`,
        edit: `rebuttal/reverse-examples/000220_edit.mp4`,
        reverse: `rebuttal/reverse-examples/000220_reverse.mp4`,
        prompt: `Transform the plain dark backdrop into a luxurious, dimly lit mahogany-paneled executive study.`,
        reversePrompt: `Transform the luxurious mahogany-paneled executive study into a minimalist, plain dark backdrop.`,
        mediaAspect: "1280 / 704"
      },
      {
        source: `rebuttal/reverse-examples/000231_source.mp4`,
        edit: `rebuttal/reverse-examples/000231_edit.mp4`,
        reverse: `rebuttal/reverse-examples/000231_reverse.mp4`,
        prompt: `Give the subject a thin silver chain necklace featuring a small, circular vintage coin pendant.`,
        reversePrompt: `Transform the subject’s attire by replacing his current shirt with a plain white t-shirt, ensuring the fabric appears smooth and slightly fitted. Remove any visible necklace or pendant from his neck area, leaving the skin and shirt surface clean and unadorned.`,
        mediaAspect: "1280 / 704"
      }
    ]
  }
];

const minuteLengthGroups = [
  {
    title: "Local Editing",
    items: [
      {
        src: `ready-to-use/long-select/000026.mp4`,
        prompt: `Remove the thick, textured gold hoop earrings from the woman's ears. Carefully reconstruct the exposed earlobes to match her natural skin tone and texture. Ensure the lighting and soft shadows on the newly bare ears blend seamlessly with the rest of her face, leaving no trace or reflection of the metallic jewelry behind.`
      },
      {
        src: `ready-to-use/long-select/005356.mp4`,
        prompt: `Replace the subject's white button-up shirt with a luxurious, dark navy blue silk blouse. The new garment should feature a soft, elegantly draped ruffled collar and a line of small, iridescent pearl buttons. Ensure the smooth silk material has a subtle sheen that realistically catches and reflects the warm, golden light coming from the background lamp throughout the sequence.`
      },
      {
        src: `ready-to-use/long-select/005571.mp4`,
        prompt: `Replace the subject's white and red track jacket with a vintage dark brown leather aviator jacket. The new garment should feature a thick, cream-colored shearling collar around the neck, rugged and slightly distressed leather texturing across the shoulders, and a heavy antique brass zipper detail along the front edge, all interacting naturally with the warm, golden ambient lighting.`
      },
      {
        src: `ready-to-use/long-select/005632.mp4`,
        prompt: `Give the subject a pair of delicate, round gold-wire eyeglasses. Ensure the thin metallic frames rest naturally on the bridge of his nose, with the clear lenses catching soft, realistic reflections from the ambient cinematic lighting, perfectly complementing his retro, preppy aesthetic without obscuring his tearful expression.`
      }
    ]
  },
  {
    title: "Background Editing",
    items: [
      {
        src: `ready-to-use/long-select/000049.mp4`,
        prompt: `Replace the solid black studio background with a clean, minimalist white-and-gray showroom interior. Add smooth light-gray paneled walls and a large rectangular overhead softbox that casts bright, diffused light across the space. Preserve the subject's pose, hand motion, white textured top, jewelry, skin tone, and shallow-depth-of-field cinematography while making the new geometric interior feel naturally integrated behind her.`
      },
      {
        src: `ready-to-use/long-select/005810.mp4`,
        prompt: `Replace the background with a cinematic, rain-streaked windowpane at dusk. Feature softly out-of-focus city lights in moody cool teal and muted amber glowing through the wet glass. Add delicate condensation and trickling raindrops to the window surface, maintaining a shallow depth of field to enhance the deeply emotional, melancholic atmosphere without altering the subject's lighting or appearance.`
      },
      {
        src: `ready-to-use/long-select/006386.mp4`,
        prompt: `Replace the background with a quiet, softly blurred European city street under an overcast sky. Include out-of-focus historic stone buildings in muted earth tones, a distant wrought-iron street lamp, and wet cobblestones subtly reflecting the ambient light. Ensure the new environment perfectly matches the soft, evenly diffused daylight on the subject.`
      }
    ]
  },
  {
    title: "Style Transfer",
    items: [
      {
        src: `ready-to-use/long-select/001657.mp4`,
        prompt: `Re-imagine the entire office scene as a warm antique wall fresco painted on aged plaster. Convert the man, desk, laptop, notebook, shelves, plants, and lamp into hand-painted forms with soft ochre tones, faded blues, simplified outlines, and visible brush texture. Add a worn gilded border, raised plaster grain, and subtle cracks across the image while preserving the original composition, gestures, object layout, and temporal motion.`
      },
      {
        src: `ready-to-use/long-select/005858.mp4`,
        prompt: `Transform the entire scene into a vibrant Fauvist painting. Re-render the woman, her phone, and the background using wild, non-naturalistic colors like electric blues, vivid greens, and intense oranges. Replace all realistic textures with energetic, thick, painterly brushstrokes and bold, contrasting outlines. Simplify her face, clothing, and the glowing lamp into flat, expressive blocks of highly saturated color, abandoning realistic lighting to create a bold, emotionally charged artwork.`
      },
      {
        src: `ready-to-use/long-select/006633.mp4`,
        prompt: `Transform the entire scene into a breathtaking Sci-Fi Art digital painting. Re-render the background as an out-of-focus futuristic cityscape with glowing holographic bokeh and sleek technological structures. Re-imagine the subject in a highly detailed, futuristic illustration style, giving her skin a flawless, subtly luminescent quality. Keep her exact features, pose, and emotional expression intact, while rendering her hair, clothing, and phone with advanced, sleek synthetic textures. Bathe the composition in atmospheric neon blues, cool cyans, and deep purples to reflect a highly advanced civilization.`
      }
    ]
  },
  {
    title: "Object Removal",
    items: [
      {
        src: `ready-to-use/long-select/006131_remove_watermark.mp4`,
        prompt: `Remove the white "GagaOOLala" watermark logo located in the top-left corner of the frame. Seamlessly blend the removed area with the surrounding background, maintaining the natural appearance of the sky, foliage, and building edges.`
      }
    ]
  }
];

const oneSourceMultipleEdits = [
  {
    src: `ready-to-use/long-one-sample-more-edits/005500.mp4`,
    prompt: `Replace the background with a dimly lit, vintage speakeasy lounge, leaving the subject and foreground elements entirely unchanged. The new environment should feature out-of-focus dark mahogany wood paneling, antique glass bottles, and softly glowing amber wall sconces. Maintain a shallow depth of field with rich, warm-toned bokeh that seamlessly complements the soft, directional lighting and classic tweed attire of the subject.`
  },
  {
    src: `ready-to-use/long-one-sample-more-edits/005503.mp4`,
    prompt: `Replace the subject's textured grey blazer with a plush, deep burgundy velvet smoking jacket. The new garment should feature smooth, black silk peak lapels that softly reflect the warm ambient light of the corridor. Ensure the rich velvet fabric maintains a tailored fit, draping naturally over his shoulders and back to provide a seamless, luxurious silhouette as he speaks, turns, and walks away.`
  },
  {
    src: `ready-to-use/long-one-sample-more-edits/005792.mp4`,
    prompt: `Transform the background into a luxurious high-rise executive office. Feature sweeping floor-to-ceiling windows that reveal a gleaming, modern metropolis under a crisp blue daytime sky. Flank the windows with rich, dark walnut wood paneling to provide elegant contrast. Enhance the spatial depth by including a subtly out-of-focus, minimalist bookshelf adorned with abstract metallic sculptures, bathed in soft, diffused natural daylight that harmonizes seamlessly with the scene.`
  },
  {
    src: `ready-to-use/long-one-sample-more-edits/005794.mp4`,
    prompt: `Remove the white flower arrangement and its green leaves from the bottom right corner of the scene, leaving a clean, empty desk surface in its place.`
  }
];

const shortVideoGroups = [
  {
    title: "Local Editing",
    items: [
      {
        source: `ready-to-use/selected_short_videos/short-local_0111_local_change_Replace_the_green_mu__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-local_0111_local_change_Replace_the_green_mu__edited.mp4`,
        prompt: `Replace the green muscle car with a sleek metallic red muscle car, ensuring it maintains the same position and pose within the video scene.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-local_0072_local_change_Replace_the_middle_a__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-local_0072_local_change_Replace_the_middle_a__edited.mp4`,
        prompt: `Replace the middle-aged man with an elderly gentleman with silver hair and wrinkles, maintaining the same position and pose within the scene.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-local_0228_local_remove_Remove_the_woman_wit__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-local_0228_local_remove_Remove_the_woman_wit__edited.mp4`,
        prompt: `Remove the woman with shoulder-length blonde hair wearing a black blazer over a black top from the entire video sequence. Ensure temporal consistent background inpainting, and leave all other video content unchanged.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-local_0253_local_add_Overlay_an_animated__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-local_0253_local_add_Overlay_an_animated__edited.mp4`,
        prompt: `Overlay an animated colorful kite in the upper left sky area of the video. The kite should flutter and sway gently as it flies, with its tail moving naturally in the wind. The kite must be tracked to the sky background as the camera moves, with lighting and shadows adjusting dynamically. All other parts of the video must remain unchanged.`
      }
    ]
  },
  {
    title: "Background Editing",
    items: [
      {
        source: `ready-to-use/selected_short_videos/short-bg_0131_background_change_Transform_the_backgr__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-bg_0131_background_change_Transform_the_backgr__edited.mp4`,
        prompt: `Transform the background into a modern art gallery. The lighting should subtly shift to highlight different paintings, with occasional soft footsteps and distant murmurs implied. The man in the foreground should remain perfectly still.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-bg_0142_background_change_Replace_the_backgrou__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-bg_0142_background_change_Replace_the_backgrou__edited.mp4`,
        prompt: `Replace the background with a dynamic ancient Roman forum. Include subtle movement of fluttering banners, distant crowds milling about, birds flying overhead, and sunlight casting moving shadows across the stone surfaces. The subject should remain perfectly still.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-bg_0161_background_change_Create_a_dynamic_cel__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-bg_0161_background_change_Create_a_dynamic_cel__edited.mp4`,
        prompt: `Create a dynamic celestial night sky background with twinkling stars, slowly drifting nebula clouds, occasional shooting stars streaking across the sky, and a softly glowing moon casting gentle light. The blue sunflowers in the foreground remain perfectly still.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-bg_0179_background_change_Replace_the_backgrou__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-bg_0179_background_change_Replace_the_backgrou__edited.mp4`,
        prompt: `Replace the background with a dynamic tropical beach at sunset. The scene should include softly rolling ocean waves, palm fronds swaying in a gentle breeze, and warm, shifting colors in the sky as the sun sets. The black Hyundai SUV and the person inside should remain perfectly still.`
      }
    ]
  },
  {
    title: "Style Transfer",
    items: [
      {
        source: `ready-to-use/selected_short_videos/short-style_0005_global_style_Apply_the_Aesthetic__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-style_0005_global_style_Apply_the_Aesthetic__edited.mp4`,
        prompt: `Apply the Aesthetic Ancient-style to this video, ensuring seamless temporal consistency across all frames. The final output should emulate the aesthetic of ancient hand-painted scrolls or temple murals, with fluid transitions between frames and soft, diffused lighting. All original motion-including character movements, camera panning, and environmental dynamics-must be precisely maintained without disruption.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-style_0025_global_style_Apply_the_dawn_aesth__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-style_0025_global_style_Apply_the_dawn_aesth__edited.mp4`,
        prompt: `Apply the dawn aesthetic to this video, ensuring seamless temporal consistency. The final output should exude the soft, warm ambiance of early morning, with gradual light transitions and pastel sky tones, all while maintaining the original motion, character actions, and camera movements without distortion.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-style_0047_global_style_Apply_the_Watercolor__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-style_0047_global_style_Apply_the_Watercolor__edited.mp4`,
        prompt: `Apply the Watercolor animation style to this video, ensuring seamless temporal consistency across all frames. The final result should mirror the soft, painterly aesthetic of watercolor art, with blended colors, fluid transitions, and gentle motion blur that aligns with the medium's organic flow. Preserve the original motion, character actions, camera movements, and narrative flow, ensuring no frame exhibits jarring changes or inconsistencies in color or texture.`
      },
      {
        source: `ready-to-use/selected_short_videos/short-style_0048_global_style_Apply_the_Chinese_In__original.mp4`,
        edit: `ready-to-use/selected_short_videos/short-style_0048_global_style_Apply_the_Chinese_In__edited.mp4`,
        prompt: `Apply the Chinese Ink Wash Painting style to this video, ensuring seamless temporal consistency across all frames. The output should mimic traditional ink wash animation, with fluid ink flow and consistent brushstroke patterns. Preserve all original motion, character actions, and camera movements to maintain narrative coherence.`
      }
    ]
  }
];

const physicalAiExamples = [
  {
    src: `ready-to-use/autodrive/000009.mp4`,
    prompt: `Transform this front-facing autonomous-driving video into a light snowfall scene at early morning. Replace rain and mist with gently falling snow, pale blue-gray dawn light, thin snow accumulation along road edges, and softened tree or building silhouettes, while keeping all vehicles, road geometry, lane markings, signs, and motion unchanged.`
  },
  {
    src: `ready-to-use/robotics/000017.mp4`,
    prompt: `Replace every visible human body part in this egocentric manipulation video with a sleek humanoid robot body. Convert all visible hands and forearms into detailed mechanical robot hands and arms, with articulated metal fingers, exposed joints, small cables, and polished dark-silver surfaces. If legs, torso, sleeves, or other body parts appear, render them as matching robotic limbs while preserving the original pose and movement. Keep all surrounding objects, tools, furniture, lighting, camera motion, shadows, and object interactions unchanged, and make the robotic limbs naturally maintain the original contacts, timing, perspective, and temporal consistency throughout the video.`
  }
];

function assetPath(path) {
  return base + path.split("/").map(encodeURIComponent).join("/");
}

function splitVideoPath(path, half) {
  return path.replace(/\.mp4$/, `__${half}.mp4`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function videoElement(src, eager = false) {
  const url = assetPath(src);
  const attr = eager && !useBlobVideoLoader ? `src="${url}"` : `data-src="${url}"`;
  return `<video ${attr} ${eager ? "autoplay" : ""} muted loop playsinline controls preload="${eager ? "auto" : "none"}" aria-label="Video demo"></video>`;
}

function pairedVideo(src, eager = false) {
  return `
    <div class="paired-video">
      ${videoElement(src, eager)}
      <a class="video-fallback" href="${assetPath(src)}" target="_blank" rel="noopener" hidden>Open MP4 directly</a>
    </div>
  `;
}

function promptDrawerHtml(prompt, isOpen, reversePrompt = "") {
  const hasReversePrompt = Boolean(reversePrompt);
  return `
    <div class="prompt-drawer ${hasReversePrompt ? "multi-edit-prompts" : ""}" data-prompt-drawer ${isOpen ? "" : "hidden"}>
      <p>${hasReversePrompt ? "<strong>Edit prompt.</strong> " : ""}${escapeHtml(prompt)}</p>
      ${hasReversePrompt ? `<p><strong>Reverse-edit prompt.</strong> ${escapeHtml(reversePrompt)}</p>` : ""}
    </div>
  `;
}

function promptButtonHtml(isOpen) {
  return `<button class="prompt-toggle" type="button" data-prompt-toggle aria-expanded="${isOpen ? "true" : "false"}">${isOpen ? "Hide prompt" : "Prompt"}</button>`;
}

function compareCard(item, index, options = {}) {
  const promptOpen = options.promptOpen ?? true;
  const isPair = Boolean(item.source && item.edit);
  const mediaAspect = item.mediaAspect ?? (isPair ? "16 / 9" : "1280 / 704");
  const panels = [
    {
      label: "Source",
      labelClass: "compare-label-source",
      src: isPair ? item.source : splitVideoPath(item.src, "source")
    },
    {
      label: "SANA-Streaming",
      labelClass: "compare-label-edit",
      src: isPair ? item.edit : splitVideoPath(item.src, "edit")
    }
  ];
  if (item.reverse) {
    panels.push({
      label: "Reverse Editing",
      labelClass: "compare-label-reverse",
      src: item.reverse
    });
  }

  return `
    <article class="compare-card" data-compare-card style="--media-aspect: ${mediaAspect}">
      <div class="compare-pair ${item.reverse ? "compare-trio" : ""}">
        ${panels.map((panel) => `
          <div class="compare-panel">
            <span class="compare-label ${panel.labelClass}">${panel.label}</span>
            ${pairedVideo(panel.src)}
          </div>
        `).join("")}
      </div>
      <div class="compare-meta">
        ${promptButtonHtml(promptOpen)}
      </div>
      ${promptDrawerHtml(item.prompt, promptOpen, item.reversePrompt)}
    </article>
  `;
}

function oneSourceMultiEditCard(items, rowIndex) {
  const source = pairedVideo(splitVideoPath(items[0].src, "source"));

  return `
    <article class="compare-card multi-edit-card" data-compare-card style="--media-aspect: 1280 / 704">
      <div class="multi-edit-row">
        <div class="compare-panel">
          <span class="compare-label compare-label-source">Source</span>
          ${source}
        </div>
        ${items.map((item, index) => `
          <div class="compare-panel">
            <span class="compare-label compare-label-edit">Edit ${index + 1}</span>
            ${pairedVideo(splitVideoPath(item.src, "edit"))}
          </div>
        `).join("")}
      </div>
      <div class="compare-meta">
        ${promptButtonHtml(true)}
      </div>
      <div class="prompt-drawer multi-edit-prompts" data-prompt-drawer>
        ${items.map((item, index) => `
          <p><strong>Edit ${index + 1}.</strong> ${escapeHtml(item.prompt)}</p>
        `).join("")}
      </div>
    </article>
  `;
}

function oneSourceMultipleEditsSection() {
  const rows = [];
  for (let i = 0; i < oneSourceMultipleEdits.length; i += 2) {
    rows.push(oneSourceMultipleEdits.slice(i, i + 2));
  }

  return `
    <div class="compare-grid one-source-grid">
      ${rows.map(oneSourceMultiEditCard).join("")}
    </div>
  `;
}

function resultGroup(group) {
  return `
    <div class="result-group">
      <h3>${escapeHtml(group.title)}</h3>
      <div class="compare-grid">
        ${group.items.map(compareCard).join("")}
      </div>
    </div>
  `;
}

function rebuttalSection(section) {
  return `
    <section class="section results-section" id="${section.id}">
      <p class="eyebrow">${escapeHtml(section.title)}</p>
      <div class="result-stack">
        <div class="compare-grid">
          ${section.items.map(compareCard).join("")}
        </div>
      </div>
    </section>
  `;
}

function render() {
  root.innerHTML = `
    <nav class="nav" aria-label="Primary">
      <a class="brand" href="#top" aria-label="SANA-Streaming home">
        <span class="brand-mark"></span>
        SANA-STREAMING
      </a>
      <div class="nav-links">
        <a href="#streaming">Minute</a>
        <a href="#one-source">One Source</a>
        <a href="#short-video">Short</a>
        <a href="#physical-ai">Physical AI</a>
        <a href="#two-minute-video">New Demos</a>
      </div>
    </nav>

    <header class="title-section" id="top">
      <h1>
        <span>SANA-Streaming</span>
        <small>Real-time Streaming Video Editing with Hybrid Diffusion Transformer</small>
      </h1>
    </header>

    <section class="section results-section" id="streaming">
      <p class="eyebrow">Minute-Length Streaming Editing</p>
      <div class="result-stack">
        <div class="compare-grid">
          ${minuteLengthGroups.flatMap((group) => group.items).map(compareCard).join("")}
        </div>
      </div>
    </section>

    <section class="section results-section" id="one-source">
      <p class="eyebrow">One Source, Multiple Edits</p>
      <div class="result-stack">
        ${oneSourceMultipleEditsSection()}
      </div>
    </section>

    <section class="section results-section" id="short-video">
      <p class="eyebrow">Short Video Editing</p>
      <div class="result-stack">
        ${shortVideoGroups.map(resultGroup).join("")}
      </div>
    </section>

    <section class="section results-section" id="physical-ai">
      <p class="eyebrow">Physical AI</p>
      <div class="result-stack">
        <div class="compare-grid">
          ${physicalAiExamples.map(compareCard).join("")}
        </div>
      </div>
    </section>

    ${rebuttalSections.map(rebuttalSection).join("")}
  `;
}

function setupPromptButtons() {
  document.querySelectorAll("[data-prompt-toggle]").forEach((button) => {
    const card = button.closest("[data-compare-card]");
    const drawer = card.querySelector("[data-prompt-drawer]");

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      const nextOpen = !isOpen;
      button.setAttribute("aria-expanded", String(nextOpen));
      button.textContent = nextOpen ? "Hide prompt" : "Prompt";
      drawer.hidden = !nextOpen;
      card.classList.toggle("is-prompt-open", nextOpen);
    });
  });
}

function setupLazyVideos() {
  const cards = [...document.querySelectorAll("[data-compare-card]")];

  const loadCard = (card) => {
    card.querySelectorAll("video[data-src]").forEach((video) => {
      if (video.src || video.dataset.loading === "true") return;

      const sourceUrl = video.dataset.src;
      if (!useBlobVideoLoader) {
        video.src = sourceUrl;
        video.load();
        return;
      }

      video.dataset.loading = "true";
      let blobUrlPromise = videoBlobUrls.get(sourceUrl);
      if (!blobUrlPromise) {
        blobUrlPromise = fetch(sourceUrl, { credentials: "same-origin" })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Video request failed with HTTP ${response.status}`);
            }
            return response.blob();
          })
          .then((blob) => {
            if (!blob.size) throw new Error("Video response was empty");
            return URL.createObjectURL(blob);
          })
          .catch((error) => {
            videoBlobUrls.delete(sourceUrl);
            throw error;
          });
        videoBlobUrls.set(sourceUrl, blobUrlPromise);
      }

      blobUrlPromise
        .then((blobUrl) => {
          video.src = blobUrl;
          video.load();
          if (card.dataset.visible === "true") {
            video.play().catch(() => {});
          }
        })
        .catch(() => {
          video.dispatchEvent(new Event("error"));
        })
        .finally(() => {
          delete video.dataset.loading;
        });
    });
  };

  const playCard = (card) => {
    const videos = [...card.querySelectorAll("video")];
    videos.forEach((video) => video.play().catch(() => {}));
  };

  const pauseCard = (card) => {
    card.querySelectorAll("video").forEach((video) => video.pause());
  };

  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => {
      loadCard(card);
      playCard(card);
      card.dataset.visible = "true";
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const card = entry.target;
      if (entry.isIntersecting) {
        card.dataset.visible = "true";
        loadCard(card);
        playCard(card);
      } else {
        pauseCard(card);
        card.dataset.visible = "false";
      }
    });
  }, { rootMargin: "240px 0px", threshold: 0.08 });

  cards.forEach((card) => observer.observe(card));
}

function setupVideoFallbacks() {
  document.querySelectorAll(".paired-video").forEach((container) => {
    const video = container.querySelector("video");
    const fallback = container.querySelector(".video-fallback");
    video.addEventListener("error", () => {
      fallback.hidden = false;
    });
    video.addEventListener("loadeddata", () => {
      fallback.hidden = true;
    });
  });
}

function setupVideoSync() {
  const sync = () => {
    const cards = [
      ...document.querySelectorAll("[data-sync-card]"),
      ...document.querySelectorAll('[data-compare-card][data-visible="true"]')
    ];

    cards.forEach((card) => {
      const videos = [...card.querySelectorAll("video")];
      if (videos.length < 2 || !videos[0].src || videos[0].readyState < 2) return;
      const leader = videos[0];

      videos.slice(1).forEach((video) => {
        if (!video.src || video.readyState < 2) return;
        if (Math.abs(leader.currentTime - video.currentTime) > 0.08) {
          video.currentTime = leader.currentTime;
        }
      });
    });
    requestAnimationFrame(sync);
  };
  requestAnimationFrame(sync);
}

function scrollToInitialHash() {
  const jump = new URLSearchParams(window.location.search).get("jump");
  const selector = jump ? `#${CSS.escape(jump)}` : window.location.hash;
  if (!selector) return;
  const target = document.querySelector(selector);
  if (!target) return;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY,
    left: 0,
    behavior: "auto"
  });
}

render();
setupPromptButtons();
setupVideoFallbacks();
setupLazyVideos();
setupVideoSync();
scrollToInitialHash();
window.addEventListener("load", () => window.setTimeout(scrollToInitialHash, 80));
