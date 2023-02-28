import v1 from "../images/v1.png";
import v2 from "../images/v2.png";
import v3 from "../images/v3.png";

export const link = (
  <svg
    viewBox="0 0 24 24"
    color="primary"
    width="20px"
    xmlns="http://www.w3.org/2000/svg"
    className="sc-4ba21b47-0 ceTLum"
  >
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.7792 21.9928 11.5602 21.9788 11.343C18.6515 16.824 10.797 19.3967 6.32085 20.232C7.93393 21.3469 9.8907 22 12 22ZM3.6987 17.5775C2.62604 15.9842 2 14.0652 2 12C2 6.47715 6.47715 2 12 2C16.6548 2 20.5667 5.18031 21.6815 9.48656C20.7816 11.0755 19.4244 12.3811 17.8282 13.4444V7.27607C17.8282 6.86948 17.4986 6.53988 17.092 6.53988H15.3742C14.9676 6.53988 14.638 6.86948 14.638 7.27607V15.0795C14.638 15.1034 14.6392 15.1269 14.6413 15.1501C14.2758 15.3076 13.906 15.4562 13.5337 15.5963V9.36196C13.5337 8.95537 13.2041 8.62577 12.7975 8.62577H11.0798C10.6732 8.62577 10.3436 8.95537 10.3436 9.36196V16.592C9.97218 16.6864 9.60348 16.7732 9.23926 16.8528V11.4479C9.23926 11.0413 8.90966 10.7117 8.50307 10.7117H6.78528C6.37869 10.7117 6.04908 11.0413 6.04908 11.4479V17.3941C5.17906 17.4987 4.38348 17.5575 3.6987 17.5775Z"></path>
  </svg>
);

export const show = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export const hide = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);

export const closeX = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const listIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

export const questionMark = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-5 h-5 text-[#8E8E8E]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  </svg>
);

export const active =
  "text-white bg-[#16A34A] hover:bg-[#139242] active:bg-[#2dac5c]";
export const inactive = "text-white bg-[#8E8E8E]";
export const greenBtn = "bg-green-600 hover:bg-green-700 active:bg-green-500";

export const version = [v1, v2, v3];

export const stakeBg = "bg-[#16A34A]";
export const unstakeBg = "bg-[#d3464f]";
