// Minimal ambient declaration to satisfy TypeScript in this workspace.
// Prefer installing real types with: npm install --save-dev @types/luxon
declare module 'luxon' {
  // only declaring the parts we use (DateTime). Keep as any to avoid strict typing here.
  export const DateTime: any;
  const _default: any;
  export default _default;
}
