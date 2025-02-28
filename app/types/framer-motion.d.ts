declare module "framer-motion" {
  import {
    ComponentType,
    ForwardRefExoticComponent,
    RefAttributes,
  } from "react";

  type MotionProps = {
    initial?: object;
    animate?: object;
    exit?: object;
    transition?: object;
    variants?: object;
    whileHover?: object;
    whileTap?: object;
    whileFocus?: object;
    whileDrag?: object;
    whileInView?: object;
    viewport?: object;
    drag?: boolean | "x" | "y";
    dragConstraints?: object;
    dragElastic?: boolean | number;
    dragMomentum?: boolean;
    dragTransition?: object;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onDrag?: () => void;
    style?: React.CSSProperties;
    className?: string;
  };

  type CreateMotionComponent = <T extends keyof JSX.IntrinsicElements>(
    component: T
  ) => ForwardRefExoticComponent<
    MotionProps & JSX.IntrinsicElements[T] & RefAttributes<Element>
  >;

  export const motion: {
    [K in keyof JSX.IntrinsicElements]: ReturnType<CreateMotionComponent>;
  };

  export const AnimatePresence: ComponentType<{
    children?: React.ReactNode;
    initial?: boolean;
    exitBeforeEnter?: boolean;
    onExitComplete?: () => void;
  }>;
}
