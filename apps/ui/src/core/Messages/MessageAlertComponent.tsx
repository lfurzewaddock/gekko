import clsx from 'clsx';

const MessageAlertComponent = ({
  messages,
  hideAlert,
  hasFailMsg = false,
  isHideAlert = false,
}: {
  messages: string[] | null;
  hideAlert: () => void;
  hasFailMsg: boolean | null;
  isHideAlert: boolean | null;
}) => {
  return !isHideAlert && messages && messages.length ? (
    <div
      role="alert"
      className={clsx('alert', hasFailMsg && 'alert-error', !hasFailMsg && 'alert-success')}
    >
      <ul>
        {messages.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        onClick={() => hideAlert()}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ) : null;
};

export default MessageAlertComponent;
