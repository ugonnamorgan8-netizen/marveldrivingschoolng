import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Car } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EnrollmentForm from "./EnrollmentForm";

type BookingContextValue = { openBooking: (course?: string) => void };

const BookingContext = createContext<BookingContextValue>({ openBooking: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext);

/** Provides `openBooking()` everywhere: every "Book" button opens this popup form. */
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState<string | undefined>();
  const [formKey, setFormKey] = useState(0);

  const openBooking = useCallback((c?: string) => {
    setCourse(c);
    setFormKey((k) => k + 1); // fresh form each time
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[92svh] overflow-y-auto rounded-2xl p-6 md:p-7">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-xl font-bold">Book a Lesson</DialogTitle>
            </div>
            <DialogDescription>
              {course ? <>Enrolling for <span className="font-semibold text-foreground">{course}</span>. </> : null}
              Reserve your spot in under a minute — we'll call you back.
            </DialogDescription>
          </DialogHeader>
          <EnrollmentForm key={formKey} source="booking" extended defaultCourse={course} idPrefix="book" />
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
};
