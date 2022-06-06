export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const executeDelayed = ( ms: number, func: (a:any)=>any ) => delay(ms).then(func);