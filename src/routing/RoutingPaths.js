import BikesPage from "../components/pages/Bikes/BikePage";
import CarPage from "../components/pages/Cars/CarPage";
import HealthPage from "../components/pages/Health/HealthPage";
import Home from "../components/pages/Home";
import ProposalPage from "../components/pages/ProposalPage";
import QuotesPage from "../components/pages/QuotesPage";
import SignIn from "../components/pages/SignIn";
import Contact from "../components/pages/contact";
import PaymentSuccessFailure from "../components/pages/PaymentSuccessFailure";
import { MyProfile } from "../components/pages/MyProfile";
import { PaymentSuccess } from "../components/pages/Payments/PaymentSuccess";
import { PaymentFailed } from "../components/pages/Payments/PaymentFailed";
import { PaymentRedirect } from "../components/pages/Payments/PaymentRedirect";
import { FutureQuotesPayment } from "../components/pages/Payments/FutureQuotesPayment"

export const routesArray = [
  {
    path: "/bike/:id?",
    component: BikesPage,
    exact: true,
  },

  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/car/:id?",
    component: CarPage,
    exact: true,
  },

  {
    path: "/quotes/:id?",
    component: QuotesPage,
    exact: true,
  },
  {
    path: "/signin",
    component: SignIn,
    exact: true,
  },
  {
    path: "/health",
    component: HealthPage,
    exact: true,
  },
  {
    path: "/proposal",
    component: ProposalPage,
    exact: true,
  },
  {
    path: "/home",
    component: Home,
    exact: true,
  },
  {
    path: "/contact",
    component: Contact,
    exact: true,
  },
  {
    path: "/paymentStatus",
    component: PaymentSuccessFailure,
    exact: true,
  },
  {
    path: "/paymentStatus",
    component: PaymentSuccessFailure,
    exact: true,
  },
  {
    path: "/myaccount/:id?",
    component: MyProfile,
    exact: true,
  },
  {
    path: "/paymentSuccess",
    component: PaymentSuccess,
    exact: true,
  },
  {
    path: "/paymentFailed/:id?",
    component: PaymentFailed,
    exact: true,
  },
  {
    path: "/paymentRedirect",
    component: PaymentRedirect,
    exact: true,
  },
  {
    path: "/futureinsurance",
    component: FutureQuotesPayment,
    exact: true,
  },
  // {
  //   path: "*",
  //   component: Home,
  //   exact: true,
  // },
];

export const routesArrayForHeader = [
  {
    path: "/home",
    heading: "Home",
    type: "home"
  },
  {
    path: "/car",
    heading: "Car",
    type: "car"

  },
  {
    path: "/bike",
    heading: "Bike",
    type: "bike"

  },
  {
    path: "/health",
    heading: "Health",
    type: "health"

  },
  {
    path: "/termlife",
    heading: "Term Life",
    type: "termlife"

  },
  {
    path: "/travel",
    heading: "Travel",
    type: "travel"

  },
  {
    path: "/myaccount",
    heading: "My Account",
    type: "myaccount"

  },
];
