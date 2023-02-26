export function setStatesValue<T>(setStates: React.Dispatch<React.SetStateAction<T>>[], value: any = '') {
  setStates.forEach((s) => s(value));
}
