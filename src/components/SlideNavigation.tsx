import { motion, AnimatePresence } from "framer-motion";
import { HoverImageLinks } from "./HoverImageLinks";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SlideNavigation = ({ open, onClose }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
            className="fixed left-0 top-0 z-50 h-screen w-[85%] md:w-[60%] bg-neutral-950 overflow-y-auto"
          >
            {/* Top Bar */}
            <div className="absolute top-6 right-6 flex items-center gap-4">
              <input
                placeholder="Search"
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white outline-none"
              />
              <button
                onClick={onClose}
                className="text-white text-xl"
              >
                ✕
              </button>
            </div>

            <HoverImageLinks />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
