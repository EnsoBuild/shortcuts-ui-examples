// check env
const eaoDisabled = JSON.parse(process.env.NEXT_PUBLIC_EOA_DISABLED ?? "false");
export const isEoaMode = !eaoDisabled;
