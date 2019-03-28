export class CloudinaryImage {
  public url: string;

  constructor(url: string) {
    this.url = url || "";
  }

  public changeWidth(w: number): CloudinaryImage {
    return new CloudinaryImage(this.url.replace("upload", `upload/w_${w}`));
  }

  public cdnUrl(): string {
    return this.url.replace("res.cloudinary.com", "imgc.iotex.io");
  }
}

export function cloudinaryImage(url: string): CloudinaryImage {
  return new CloudinaryImage(url);
}
