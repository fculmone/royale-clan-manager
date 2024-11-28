import { ImageSlider } from "./ImageSlider";

const img1 = "how-to-input-clan-images/edited-img1.jpg";
const img2 = "how-to-input-clan-images/edited-img2.jpg";
const img3 = "how-to-input-clan-images/edited-img3.jpg";
const img4 = "how-to-input-clan-images/edited-img4.jpg";

const IMAGES = [img1, img2, img3, img4];

export function HowToInputClan() {
  return <ImageSlider imageUrls={IMAGES} />;
}
