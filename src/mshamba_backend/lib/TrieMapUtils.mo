import TrieMap "mo:base/TrieMap";
import Iter "mo:base/Iter";
import Hash "mo:base/Hash"; // Required for the Hash.Hash type in the keyHash function

module TrieMapUtils {

  /**
   * Creates a new TrieMap from an iterator of key-value pairs.
   * @param iter An iterator producing (key, value) tuples.
   * @param keyEq A function to compare two keys for equality.
   * @param keyHash A function to compute the hash of a key.
   * @returns A new TrieMap populated with the elements from the iterator.
   */
  public func fromIter<K, V>(
    iter : Iter.Iter<(K, V)>,
    keyEq : (K, K) -> Bool,
    keyHash : K -> Hash.Hash
  ) : TrieMap.TrieMap<K, V> {
    // Initialize a new empty TrieMap with the provided equality and hash functions.
    var map = TrieMap.TrieMap<K, V>(keyEq, keyHash);

    // Iterate over each key-value pair from the input iterator
    // and insert them into the new TrieMap.
    for ((k, v) in iter) {
      map.put(k, v);
    };

    return map;
  };

}
