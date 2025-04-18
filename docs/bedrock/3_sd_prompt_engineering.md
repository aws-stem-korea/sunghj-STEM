# Bedrock Model - Stable Diffusion

## Prompt Engineering 기법

---

### 0. Keyword (Phrase)
효과적인 Stable Diffusion Prompt는 Keyword 또는 Phrase(=문구)의 모음으로 구성됩니다. 단순 명사(cat), 수식어+명사 등 다양한 형식을 가집니다. Prompt 내에서 Keyword 또는 Phrase가 여러 개일 경우 앞선 요소의 우선순위가 높고, 각 요소는 쉼표로 구분됩니다.
- Prompt Example

  ```
  best quality, apple, oil painting
  ```

- Result

  <img src="/img/hackathon/generated_apple.jpg" width="160px" />

---

### 1. 화질 향상
- 웹 이미지 기반 학습 → 특정 웹 사이트 이름
```
- artstation
- deviantart
- trending artstation
- trending on deviantart
```
- 고화질 이미지에 자주 붙는 태그
```
- masterpiece
- best quality
- concept art
- extremely detailed
- ultra-detailed
- brilliant photo
- beautiful composition
- sharp focus
- 4k
- 8k
- ray tracing
- cinematic lighting
- cinematic postprocessing
- realism
```
- 캐릭터 얼굴 퀄리티 높여주는 문구
```
- cute eye
- small nose
- small mouth
- beautiful face
- brilliant face
- perfect symmetrical face
- fine detailed face
- aesthetic eyes
- kawaii cute girl
```

---

### 2. 화풍과 화가
- style of xxxxx
```
- gothic
- renaissance
- baroque
- rococo
- chinoiserie
- romanticism
- realism
- victorian painting
- japonisme
- impressionism
- art nouveau
- cubism
- art deco
- surrealism
- pop art
- japanese anime
```
- 미술기법
```
- digital painting
- oil painting
- watercolor painting
- ink watercolor
- acrylic painting
- crayon painting
- pen art
- ball-point pen art
- drawing
- pencil sketch
- pencil drawing
- ukiyo-e painting
- etching
- pointillism
- pixel art
- stained glass
- woodcut
- bold line painting
```

---

### 3. 시점과 빛
- 원거리 근거리
```
- far long shot
- long shot
- very wide shot
- wide shot
- medium shot
- west shot
- bust shot
- close up shot
- close up front shot
- close-up shot
- closeup
- head shot
- face closeup photo
```
- 각도
```
- below view
- overhead view
- near view
- bird view
- selfie shot angle
- wide shot angle
- shot form a birds eye camera angle
```
- 인물
```
- portrait
- snap shot
```
- 풍경화
```
- landscape
- upper sunlight
- golden sun
- upper sunlight and golden sun
```
- 좋은 화면 구성
```
- beautiful composition 
```
- 선명한 이미지
```
- sharp focus
```
- 화려한 이미지
```
- bright color contrast
```
- 조명
```
- soft lighting
- cinematic lighting
- golden hour lighting
- strong rim light
- volumetric top lighting
- atmospheric lighting
- cinematic postprocessing top light
- brilliant photo
- best shot
```
- 적당한 배경
```
- beautiful background
```

---

### 4. 디테일 조작
뼈대가 되는 큰 부분 먼저, 세부 부분 나중에 작성 추천 (자세 → 옷 → 장식 → 머리 → 표정 → …)
```
자세, 옷, 장식, 머리, 표정, ...
standing pose, white frilly dress, puffy sleeves, twin tails with blue ribbons, gentle smile
```

---

### 5. Negative Prompt
Negative Prompt로 생성된 이미지에서 보고 싶지 않은 항목의 키워드를 지정할 수 있습니다. (최대 10,000자)
```
bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, missing arms, long neck, humpbacked, shadow, flat shading, flat color, grayscale, black&white, monochrome, frame,
```
저화질 제외
```
worst quality, low quality, normal quality, jpeg artifacts, blurry, long neck, humpbacked, flat shading, flat color, grayscale, black&white, monochrome
```
서투른 요소(신체 등) 제외
```
bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, missing arms
```
불필요한 요소 제외
```
text, error, signature, watermark, username, shadow, frame
```

---

### 6. 가중치 (키워드 강조/억제)
- `(키워드)` : 1.1배 강조 (x1.1)
- `[키워드]` : 1.1배 억제 (x1/1.1)
- `[[키워드]], ((키워드))` : 등의 강조/억제 효과 겹치기도 가능
- `(키워드:숫자)` : (yellow:1.3) 같이 가중치 주고 싶은 키워드에 강조 및 억제 가능 (숫자는 0.1~1.4 권장)
```
((best quality)), [green], (apple:1.3), oil painting

# best quality : 1.2배 강조 (=1.1*1.1배 강조)
# green : 0.91배 강조 (=1.1배 억제)
# apple : 1.3배 강조
# oil painting : 1배 강조 (기본값)
```

---

### 7. 만화/애니메이션 스타일
```
Cartoons, Anime, Comics, Kawaii, Manhwa, Animecore, UwU, MarveI Comics, Manga
```

---