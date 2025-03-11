// spCode.ts
// components/boxes/spCode.ts
export const spCode = (): string => {
  return `
      let audio = input();
      let pointerDown = input();
      
      setMaxIterations(5);
      let s = getSpace();
      let r = getRayDirection();
      
      let n1 = noise(r * 4 + vec3(0, audio, vec3(0, audio, audio)) * .5);
      let n = noise(s + vec3(0, 0, audio + time * .1) + n1);
      
      metal(n * .5 + .5);
      shine(n * .5 + .5);
      
      color(normal * .1 + vec3(0, 0, 1));
      displace(mouse.x * 2, mouse.y * 2, 0);
      boxFrame(vec3(2), abs(n) * .1 + .04);
      mixGeo(pointerDown);
      sphere(n * .5 + .8);
    `;
};
