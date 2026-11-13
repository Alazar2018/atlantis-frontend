const crop = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const studioImages = {
  hero: crop("photo-1608256246200-53e635b5b65f", 1800),
  bag: crop("photo-1627123424574-724758594e93", 1400),
  shoes: crop("photo-1449505278894-297fdb3edbc1", 1400),
  boots: crop("photo-1608256246200-53e635b5b65f", 1400),
  satchel: crop("photo-1627123424574-724758594e93", 1400),
  wallet: crop("photo-1627123424574-724758594e93", 1200),
  atelier: crop("photo-1627123424574-724758594e93", 1600),
  pack: crop("photo-1553062407-98eeb64c6a62", 1200),
};
