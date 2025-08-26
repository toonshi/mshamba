import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  // HashMap to store images: ImageId (Text) -> ImageData (Vec Nat8)
  private var images = HashMap.HashMap<Text, [Nat8]>(100, Text.equal, Text.hash);
  private var nextId: Nat = 0;

  // Function to upload an image
  public func uploadImage(imageData: [Nat8]) : async Text {
    let imageId = "img-" # Nat.toText(nextId);
    nextId := nextId + 1;
    images.put(imageId, imageData);
    return imageId;
  };

  // Function to retrieve an image
  public query func getImage(imageId: Text) : async ?[Nat8] {
    return images.get(imageId);
  };

  // Function to delete an image (optional, but good practice)
  public func deleteImage(imageId: Text) : async Bool {
    if (images.get(imageId) != null) { // Check if image exists
      images.delete(imageId); // Delete it
      true
    } else {
      false
    }
  };
}