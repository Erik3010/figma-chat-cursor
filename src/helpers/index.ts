export const randomId = () => Math.random().toString(36).substring(2, 15);

export const measureTextWidth = (text: string, fontSize: number) => {
  const div = document.createElement("div");
  div.classList.add("sizer");
  div.style.fontSize = `${fontSize}px`;
  div.innerHTML = text;

  document.body.append(div);
  const { width } = div.getBoundingClientRect();
  div.remove();

  return width;
};

export const isEmptyString = (value: any) => ["", null].includes(value);
