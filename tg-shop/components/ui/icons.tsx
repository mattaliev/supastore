export function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export function PaymentSuccessIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className + " animate-scale-down scale-[2]"}
      style={{ animationDelay: "1.5s" }}
    >
      <path
        className="animate-draw-circle"
        strokeDasharray="166"
        strokeDashoffset="0"
        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
      />
      <polyline
        className="animate-draw-check"
        strokeDasharray="40"
        strokeDashoffset="40"
        points="9 11.01 12 14.01 22 4"
      />
    </svg>
  );
}

export function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 710.80798 232.85068"
      height="24"
      width="24"
      fill={""}
      stroke={"currentColor"}
      strokeWidth={"2"}
      strokeLinecap={"round"}
    >
      <defs id="defs6">
        <clipPath id="clipPath18" clipPathUnits="userSpaceOnUse">
          <path id="path16" d="M 0,174.638 H 533.106 V 0 H 0 Z" />
        </clipPath>
      </defs>
      <g transform="matrix(1.3333333,0,0,-1.3333333,0,232.85067)" id="g10">
        <g id="g12">
          <g clip-path="url(#clipPath18)" id="g14">
            <g transform="translate(105.7874,83.6595)" id="g20">
              <path d="m 0,0 c 0,0 2.042,-7.404 -5.958,-20.596 -8,-13.191 -20.766,-12 -20.766,-12 H -49.617 V 2.128 h -2.724 v 3.83 h 2.724 v 36.595 h 25.021 c 0,0 15.234,-0.68 20.426,-11.149 C -0.145,23.288 0.233,8 0.233,8 H -2.639 V 0 Z m 21.92,8.814 h 2.605 c 0,0 0.581,14.676 -7.589,32.377 C 8,61.702 -20.851,62.627 -20.851,62.627 h -51.71 V 4.712 h -2.943 V 2.981 h 2.943 v -55.578 h 50.73 c 0,0 23.107,-2.382 35.788,18.98 9.532,14.213 10.085,33.064 10.085,33.064 h -2.297 c 0,0 0.143,2.761 0.143,4.548 0,1.787 0.032,4.819 0.032,4.819" />
            </g>
            <g transform="translate(146.681,146.2869)" id="g24">
              <path d="m 0,0 h 23.872 v -52.202 h -2.553 v -12.893 h 2.553 v -50.208 H 0 v 51.357 h -2.426 v 10.851 h 2.681 z" />
            </g>
            <g transform="translate(183.5745,146.2869)" id="g28">
              <path d="m 0,0 h 93.446 v -20.159 h -34.85 v -29.107 h -2.298 v -18.382 h 2.553 v -47.655 h -24 v 48.42 H 32.17 v 16.341 h 2.936 v 30.255 l -35.106,0 z" />
            </g>
            <g transform="translate(364.4681,107.8724)" id="g32">
              <path d="m 0,0 h 24.255 c 0,0 -3.702,40.596 -48.383,40.596 -50.042,0 -53.361,-49.915 -53.361,-49.915 h -2.937 c 0,0 -0.595,-5.915 -0.595,-11.021 0,-5.107 0.51,-10.511 0.51,-10.511 h 2.809 c 0,0 3.021,-49.107 51.702,-49.107 45.915,0 49.361,42.043 49.361,42.043 H 0.383 c 0,0 -3.32,-21.106 -27.064,-21.106 -22.978,0 -26.217,27.234 -26.217,27.234 h -2.698 c 0,0 -0.734,6.096 -0.734,12.319 0,6.223 0.926,11.234 0.926,11.234 h 2.776 c 0,0 2.585,28.404 28.5,28.404 C -2.298,20.17 0,0 0,0" />
            </g>
            <g transform="translate(406.596,146.4256)" id="g36">
              <path d="m 0,0 h 24 v -41.745 h -2.937 v -2.297 h 45.32 v 3.829 h 3.063 V 0 h 23.363 v -39.191 h -2.554 v -38.171 h 2.554 v -37.915 H 69.063 v 38.553 H 66.511 V -63.83 H 21.319 V -74.936 H 24 v -40.341 H 0 v 41.362 h -2.681 v 31.021 h 2.936 z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
