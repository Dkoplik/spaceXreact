import { cachedFetch } from "./cache";

const BASE_URL = "https://ll.thespacedevs.com/2.3.0";

class SpaceX {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // async _get(path) {
  //   const res = await fetch(`${this.baseUrl}${path}`);
  //   if (!res.ok) {
  //     throw new Error(`LL2 request failed: ${res.status} ${res.statusText}`);
  //   }
  //   const data = await res.json();
  //   return data.results ?? data;
  // }

  async launchpads() {
    const url = `${BASE_URL}/pads/?limit=100`;
    const data = await cachedFetch(url);
    return data.results;
  }

  async launchpad(id) {
    const url = `${BASE_URL}/pads/${id}`;
    const data = await cachedFetch(url);
    return data.results;
  }

  async launches() {
    const url = `${BASE_URL}/launches/?lsp__name=SpaceX&limit=100`;
    const data = await cachedFetch(url);
    return data.results;
  }

  async launch(id) {
    const url = `${BASE_URL}/launches/${id}`;
    const data = await cachedFetch(url);
    return data.results;
  }
}

export { SpaceX };
