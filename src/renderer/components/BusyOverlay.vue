<template>
  <div id="loader-wrapper-outside">
    <div class="lds-lring">
      <div class="lring" />
      <div class="lring" />
      <div class="lring" />
      <div class="lring" />
      <div class="lring" />
      <div class="lring" />

      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 338.15 386">
          <defs>
            <style>
              .cls-1 {
              fill: #268334;
              stroke: #268334;
              }
              .cls-1,
              .cls-2 {
              stroke-miterlimit: 10;
              stroke-width: 18px;
              }
              .cls-2 {
              fill: none;
              stroke: #fff;
              }
            </style>
          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Logo_versions" data-name="Logo versions">
              <path
                class="cls-1"
                d="M169,9c5.67,0,18.23.1,23.91.26,45.15,1.29,89.57,7.85,133.39,18.68,3.1.77,2.82,2.6,2.82,4.77,0,61-.14,105.94.07,166.93.06,16.7-1.08,33.06-7,48.83-5.05,13.34-12.85,24.93-22.31,35.43C267.6,319.65,222.73,352,179.15,374.63a21,21,0,0,1-10,2.37H169a21,21,0,0,1-10-2.37c-43.58-22.64-88.46-55-120.65-90.73-9.46-10.5-17.26-22.09-22.3-35.43-6-15.77-7.11-32.13-7-48.83.21-61,.09-105.93.08-166.93,0-2.17-.29-4,2.81-4.77,43.83-10.83,88.25-17.39,133.4-18.68C151,9.1,163.28,9,169,9"
              />
              <line
                class="cls-2"
                x1="49.09"
                y1="81.66"
                x2="49.09"
                y2="233.33"
              />
              <line
                class="cls-2"
                x1="89.09"
                y1="113.66"
                x2="89.09"
                y2="201.33"
              />
              <line
                class="cls-2"
                x1="129.09"
                y1="97.66"
                x2="129.09"
                y2="217.33"
              />
              <line
                class="cls-2"
                x1="169.15"
                y1="57.33"
                x2="169.09"
                y2="257.33"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
#loader-wrapper-outside {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: hsla(0, 0%, 100%, 0.8);
}

.lds-lring {
  /* change color here */
  color: #268334;
}
.lds-lring,
.lds-lring .lring {
  box-sizing: border-box;
}
.lds-lring {
  display: inline-block;
  position: relative;
  width: min(40vh, 90vw);
  height: min(40vh, 90vw);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.lds-lring .lring {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: calc(min(40vh, 90vw) - 1px);
  height: calc(min(40vh, 90vw) - 1px);
  border: 5px solid currentColor;
  border-radius: 50%;
  animation: lds-lring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: currentColor transparent transparent transparent;
}
.lds-lring .lring:nth-child(1) {
  border-color: white transparent transparent transparent;
  border-width: 6px;
}
.lds-lring .lring:nth-child(2) {
  animation-delay: -0.1s;
}
.lds-lring .lring:nth-child(3) {
  animation-delay: -0.2s;
}
.lds-lring .lring:nth-child(4) {
  border-color: #63c772 transparent transparent transparent;
  animation-delay: -0.3s;
}
.lds-lring .lring:nth-child(5) {
  border-color: #a3ecae transparent transparent transparent;
  animation-delay: -0.4s;
}
.lds-lring .lring:nth-child(6) {
  animation-delay: -0.5s;
  border-color: white transparent transparent transparent;
  border-width: 6px;
  z-index: 6;
  top: -0.5px;
  left: -0.5px;
  width: min(40vh, 90vw);
  height: min(40vh, 90vw);
}
@keyframes lds-lring {
  0% {
    transform: rotate(135deg);
  }
  75% {
    transform: rotate(495deg);
  }
  100% {
    transform: rotate(495deg);
  }
}

.lds-lring .logo {
  width: min(15vh, 36vw);
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
