/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import specific icons */
import {
  faRankingStar,
  faUser,
  faGear,
  faCircleInfo,
  faChevronDown,
  faBars,
  faPenToSquare,
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLightbulb,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(
  faUser,
  faLightbulb,
  faGear,
  faCircleInfo,
  faRankingStar,
  faChevronDown,
  faBars,
  faPenToSquare,
  faArrowLeftLong,
  faEye,
  faEyeSlash,
  faArrowRightLong
);

export default {
  library,
};
