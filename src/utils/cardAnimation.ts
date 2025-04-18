export const MouseMoveHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

  const currentX = e.nativeEvent.offsetX;
  const currentY = e.nativeEvent.offsetY;
  const rotateX = 40/330 * currentY - 12;
  const rotateY = -60/459 * currentX + 20;

  const pointerFromCenter = (min = 0, max = 1) => {
    const value = Math.sqrt(((currentY - (459/2)) / (459/2)) ** 2 + ((currentX - (330/2)) / (330/2)) ** 2)
    return Math.min(Math.max(value, min), max);
  }

  const card = e.currentTarget as HTMLElement
  card.style.transition = '0s'
  card.style.transform = `perspective(750px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  const shine = e.currentTarget.getElementsByClassName('shine')[0] as HTMLElement
  // shine.style.backgroundImage = `
  //   url(${foil}), 
  //   linear-gradient( 45deg, hsl(46, 95%, 50%), hsl(52, 100%, 69%) ), 
  //   radial-gradient( 
  //     farthest-corner circle at ${currentX}px ${currentY}px, 
  //     hsla(10, 20%, 90%, 0.95) 10%, 
  //     hsl(0, 0%, 0%) 70% 
  //   )`;
  shine.style.backgroundSize = 'cover, cover, cover';
  shine.style.backgroundPosition = 'center center, center center, center center'
  shine.style.backgroundBlendMode = 'hard-light, multiply'
  shine.style.mixBlendMode = 'lighten'
  shine.style.filter = 'brightness(1.25) contrast(1.25) saturate(0.35)'
  shine.style.opacity = '0.2'

  const glare = e.currentTarget.getElementsByClassName('glare')[0] as HTMLElement
  glare.style.backgroundImage = `radial-gradient(
    farthest-corner circle at ${currentX}px ${currentY}px,
    hsla(0, 0%, 100%, 0.8) 10%,
    hsla(0, 0%, 100%, 0.65) 20%,
    hsla(0, 0%, 0%, 0.5) 90%
  )`
  glare.style.mixBlendMode = 'overlay';
  glare.style.filter = 'brightness(0.9) contrast(1.25) saturate(0.35)';
  glare.style.opacity = `${(pointerFromCenter() + 0.2) * 1.2}`;
}

export const MouseOutHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const card = e.currentTarget as HTMLElement
  card.style.transition = '0.6s'
  card.style.transform = `perspective(750px) rotateX(0deg) rotateY(0deg)`

  const shine = e.currentTarget.getElementsByClassName('shine')[0] as HTMLElement
  shine.style.backgroundImage = ``
  shine.style.mixBlendMode = `color-dodge`;
  // shine.style.maskImage = `url(${mask})`
  shine.style.maskSize = 'cover'
  shine.style.maskPosition = 'center center'

  const glare = e.currentTarget.getElementsByClassName('glare')[0] as HTMLElement
  glare.style.opacity = `0`
}