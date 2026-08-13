export const searchNotion = (params: any) => {
  return fetch(`/api/searchPageByBlock`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((res) => {
      if (res.ok) {
        return res;
      }

      // convert non-2xx HTTP responses into errors
      const error: any = new Error(res.statusText);
      error.response = res;
      return Promise.reject(error);
    })
    .then((res) => res.json());
};
