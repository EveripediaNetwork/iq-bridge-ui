import { createGlobalStyle } from "styled-components";

import "../scss/theme.scss";

const GlobalStyle = createGlobalStyle`
 body {
  min-height: 100%;
  background: rgb(45,132,253);
background: linear-gradient(0deg, rgba(45,132,253,1) 0%, rgba(222,237,237,1) 100%);

  background-attachment: fixed;
 }

 div.input-group > input.form-control {
  text-align: center !important;
  font-weight: bold;
}

 
 .card {
    max-width: 450px;
 }
 
 .card-body {
    padding: 0.85rem !important;
}
 
 .list-group {
    .disabled {
        img {
            opacity:0.5;
        }
    }
 }

 .monospace {
   font-family: monospace
 }

 .nav-tabs .nav-link.active {
   border-color: transparent !important;
   font-weight: bold
 }

 .nav-link:hover {
  border-color: none !important;
 }
 
 .tooltip-inner {
   border-radius: 0px !important;
 }

 html {
  height: 100%;
}

.brain {
  animation-name: brain-animation;
  animation-duration: 2.5s;
  transform-origin: 70% 70%;
  display: inline-block;
  cursor: pointer;
  animation-iteration-count: 1;
}

@keyframes brain-animation {
    0% { transform: rotate( 0.0deg) }
   10% { transform: rotate(14.0deg) }
   20% { transform: rotate(-8.0deg) }
   30% { transform: rotate(14.0deg) }
   40% { transform: rotate(-4.0deg) }
   50% { transform: rotate(10.0deg) }
   60% { transform: rotate( 0.0deg) }
  100% { transform: rotate( 0.0deg) }
}

.animate {
    animation: textAnimation 1s infinite alternate;
  }

@keyframes textAnimation {
  0% { color: #000000;  }
  10% { color: #262626;  }
  20% { color: #363636;  }
  30% { color: #404040;  }
  40% { color: #575555;  }
  50% { color: #737373;  }
  60% { color: #a1a1a1;  }
100% { color: #ffffff;  }
}
`;

export default GlobalStyle;
