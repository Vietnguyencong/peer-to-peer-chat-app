import { useEffect, useState } from "react";

const PREFIX = "CHAT-";
// get the key from local
// store the key into the local when init
// key exists:
//  update the key when call the set value function
export default function useLocalStorage(key, initValue) {
  const prefixKey = PREFIX + key;
  const [value, setValue] = useState(() => {
    // return if the json value in the local
    const jsonValue = localStorage.getItem(prefixKey);
    if (key === "contacts") {
      console.log("contacts from localstroage", JSON.parse(jsonValue));
    }
    if (
      jsonValue != null &&
      jsonValue !== "undefined" &&
      jsonValue !== "null"
    ) {
      return JSON.parse(jsonValue);
    }
    if (typeof initValue === "function") return initValue();
    else return initValue;
  });

  useEffect(() => {
    localStorage.setItem(prefixKey, JSON.stringify(value));
  }, [prefixKey, value]); // init when set

  return [value, setValue];
}
