import svgPaths from "./svg-b85se2q3r7";
import imgMenu from "figma:asset/08053b6c3ea6656ccfd054581cda74133806cc59.png";
import imgSearch1 from "figma:asset/eb5e81f07a0f30d86d5995b33def83538f1d79bf.png";
import imgUser2 from "figma:asset/ef1e225c90c50e63b355405a6cd78d0056cc295a.png";
import imgGroceryStore from "figma:asset/8b97975c7850de09ba5d6887e0349b9d4ec5bdc5.png";
import imgImage1 from "figma:asset/b2c6685207093306df225909ebc355b34b438462.png";
import imgFacebookAppSymbol from "figma:asset/ee2f66ba2898f5bbbb11a7b6bed3b06d5257288f.png";
import imgTwitter from "figma:asset/7e429b5600ee1ea1439ca8d3ab109a2b08f151a9.png";
import imgInstagram from "figma:asset/53067ecd8579ea07e9af6c787c6afb6025ed36c8.png";
import imgMouse from "figma:asset/c837b45ed1b396f6f76366ff6af5462cfa9b1d3c.png";

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[57px] items-center justify-end left-[1678px] top-[52px]">
      <div className="relative shrink-0 size-[30px]" data-name="search (1)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSearch1} />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="user (2)">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUser2} />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="grocery-store">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGroceryStore} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[57px] items-start left-[50px] top-[943px]">
      <div className="relative shrink-0 size-[30px]" data-name="facebook-app-symbol">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgFacebookAppSymbol} />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="twitter">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgTwitter} />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="instagram">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgInstagram} />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents font-['Poppins:Medium',sans-serif] leading-[normal] left-[30px] not-italic text-[#8b8b8b] text-[50px] top-[458px]">
      <p className="absolute left-[30px] top-[458px]">02</p>
      <p className="absolute left-[30px] top-[513px]">03</p>
      <p className="absolute left-[30px] top-[568px]">04</p>
      <p className="absolute left-[30px] top-[623px]">05</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-[335px]">
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[20px] not-italic text-[100px] text-white top-[335px]">01</p>
      <div className="absolute h-0 left-0 top-[413px] w-[120px]">
        <div className="absolute inset-[-6px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 120 6">
            <line id="Line 2" stroke="var(--stroke-0, #F19695)" strokeWidth="6" x2="120" y1="3" y2="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-[335px]">
      <Group />
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[1056px] top-[229px]">
      <div className="absolute flex h-[310px] items-center justify-center left-[1087px] top-[504px] w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <div className="h-0 relative w-[310px]">
            <div className="absolute inset-[-10px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 310 10">
                <line id="Line 3" stroke="var(--stroke-0, #F19695)" strokeWidth="10" x2="310" y1="5" y2="5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[259px] items-center justify-center left-[1056px] top-[229px] w-[53px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative text-[35px] text-white">SMART WATCH</p>
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[1168px] top-[729px]">
      <div className="absolute bg-white h-[70px] left-[1168px] rounded-[6px] top-[729px] w-[275px]" />
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[40.923px] leading-[normal] left-[1190px] not-italic text-[25px] text-black top-[744px] w-[231px] whitespace-pre-wrap">Add to cart - $399</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[1056px] top-[187px]">
      <Group3 />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[normal] left-[1168px] not-italic text-[100px] text-white top-[187px]">FOSSIL</p>
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[0] left-[1168px] not-italic text-[80px] text-white top-[324px]">
        <span className="font-['Poppins:Regular',sans-serif] leading-[normal]">Super</span>
        <span className="leading-[normal]">{` `}</span>
        <span className="font-['Poppins:Bold',sans-serif] leading-[normal]">Luxury</span>
      </p>
      <div className="absolute font-['Poppins:Regular',sans-serif] leading-[normal] left-[1168px] not-italic text-[40px] text-white top-[459px] whitespace-nowrap">
        <p className="mb-0">{`Lorem ipsum dolor sit `}</p>
        <p className="mb-0">{`amet, consectetur `}</p>
        <p>adipiscing elit. sed diam</p>
      </div>
      <Group4 />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-clip relative rounded-[30px] size-full" data-name="Landing Page" style={{ backgroundImage: "linear-gradient(rgb(107, 107, 107) 0%, rgb(255, 255, 255) 15.625%, rgb(255, 255, 255) 50%, rgb(255, 255, 255) 84.896%, rgb(107, 107, 107) 100%)" }}>
      <div className="absolute left-[-711px] size-[1317px] top-[-159px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1317 1317">
          <circle cx="658.5" cy="658.5" fill="var(--fill-0, #2B2B2B)" id="Ellipse 1" r="658.5" />
        </svg>
      </div>
      <div className="absolute h-[1317px] left-[773px] top-[-159px] w-[1486px]" data-name="Union">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1486 1317">
          <path d={svgPaths.p3d48ee00} fill="var(--fill-0, #2B2B2B)" id="Union" />
        </svg>
      </div>
      <div className="absolute left-[50px] size-[30px] top-[52px]" data-name="menu">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgMenu} />
      </div>
      <Frame />
      <p className="absolute font-['Post_No_Bills_Colombo_ExtraBold:Regular',sans-serif] leading-[normal] left-[126px] not-italic text-[50px] text-white top-[29px]">S’wisp</p>
      <div className="absolute left-[359px] size-[652px] top-[174px]">
        <div className="absolute inset-[-12.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 812.2 812.2">
            <g filter="url(#filter0_d_1_720)" id="Ellipse 4">
              <circle cx="406.1" cy="406.1" fill="var(--fill-0, #FDE9E9)" r="326" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="812.2" id="filter0_d_1_720" width="812.2" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feMorphology in="SourceAlpha" operator="dilate" radius="34" result="effect1_dropShadow_1_720" />
                <feOffset />
                <feGaussianBlur stdDeviation="23.05" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_720" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_720" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[426px] size-[518px] top-[241px]">
        <div className="absolute inset-[-10.97%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 631.6 631.6">
            <g filter="url(#filter0_d_1_714)" id="Ellipse 5">
              <circle cx="315.8" cy="315.8" fill="var(--fill-0, #F19695)" r="259" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="631.6" id="filter0_d_1_714" width="631.6" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feMorphology in="SourceAlpha" operator="dilate" radius="16" result="effect1_dropShadow_1_714" />
                <feOffset />
                <feGaussianBlur stdDeviation="20.4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_714" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_714" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[318px] size-[734px] top-[133px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[1117px] not-italic text-[35px] text-white top-[40px]">MEN</p>
      <p className="absolute font-['Poppins:Medium',sans-serif] leading-[normal] left-[1396px] not-italic text-[35px] text-white top-[40px]">WOMEN</p>
      <div className="absolute h-0 left-[1111px] top-[88px] w-[88px]">
        <div className="absolute inset-[-2px_-2.27%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 92 4">
            <path d="M2 2H90" id="Line 1" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="4" />
          </svg>
        </div>
      </div>
      <Frame1 />
      <Group2 />
      <Group5 />
      <div className="absolute left-[1862px] size-[50px] top-[914px]" data-name="mouse">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-[20%] max-w-none size-full top-0" src={imgMouse} />
        </div>
      </div>
      <div className="absolute flex h-[542px] items-center justify-center left-[1735px] top-[calc(50%-271px)] w-[299px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <p className="font-['Post_No_Bills_Colombo_ExtraBold:Regular',sans-serif] leading-[normal] not-italic relative text-[200px] text-[rgba(161,161,161,0.3)]">WATCH</p>
        </div>
      </div>
    </div>
  );
}