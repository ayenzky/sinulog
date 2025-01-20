import { useState } from "react";
import Head from "next/head";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import scheduleData from "@/styles/schedule.json";
import Image from "next/image";

interface Event {
  name: string;
  time: string;
  venue: string;
  note?: string;
}

interface ScheduleItem {
  date?: string;
  dateRange?: string;
  events: Event[];
}

interface Marker {
  title: string;
  position: { lat: number; lng: number };
  events: Event[];
  image: string;
}

const venueCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "SM Seaside Cebu": { lat: 10.2754, lng: 123.8535 },
  GMall: { lat: 10.3127, lng: 123.8854 },
  "Basilica del Sto. Nino": { lat: 10.2929, lng: 123.9021 },
  "Basilica Minore del Sto. Niño": { lat: 10.2929, lng: 123.9021 },
  "Cebu City Sports Center": { lat: 10.3036, lng: 123.8977 },
  "Fuente Osmeña": { lat: 10.3089, lng: 123.8914 },
  "Plaza Independencia": { lat: 10.2925, lng: 123.9054 },
  SRP: { lat: 10.264, lng: 123.8827 },
  "SM City Cebu": { lat: 10.3119, lng: 123.9178 },
  "Ayala Center Cebu": { lat: 10.3187, lng: 123.9044 },
  "The Terraces, Ayala Center": { lat: 10.3187, lng: 123.9044 },
  "MCIAA T1": { lat: 10.3078, lng: 123.9794 }, // Mactan Airport Terminal 1
  "Nustar Convention Center": { lat: 10.2917, lng: 123.9081 },
  "Waterfront Cebu City Hotel & Casino": { lat: 10.3172, lng: 123.915 },
};

const venueImages: { [key: string]: string } = {
  "SM Seaside Cebu":
    "https://images.unsplash.com/photo-1519567770579-c2fc5436bcf9?w=800&auto=format&fit=crop",
  GMall:
    "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800&auto=format&fit=crop",
  "Basilica del Sto. Nino":
    "https://images.unsplash.com/photo-1548625361-58a9b86aa83b?w=800&auto=format&fit=crop",
  "Basilica Minore del Sto. Niño":
    "https://images.unsplash.com/photo-1548625361-58a9b86aa83b?w=800&auto=format&fit=crop",
  "Cebu City Sports Center":
    "https://images.unsplash.com/photo-1542652694-40abf526446e?w=800&auto=format&fit=crop",
  "Fuente Osmeña":
    "https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?w=800&auto=format&fit=crop",
  "Plaza Independencia":
    "https://images.unsplash.com/photo-1584289537662-27851fd5ab5b?w=800&auto=format&fit=crop",
  SRP: "https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?w=800&auto=format&fit=crop",
  "SM City Cebu":
    "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800&auto=format&fit=crop",
  "Ayala Center Cebu":
    "https://images.unsplash.com/photo-1519567770579-c2fc5436bcf9?w=800&auto=format&fit=crop",
  "The Terraces, Ayala Center":
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop",
  "MCIAA T1":
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop",
  "Nustar Convention Center":
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&auto=format&fit=crop",
  "Waterfront Cebu City Hotel & Casino":
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
};

const eventImages: { [key: string]: string } = {
  // Religious Events
  "WALK WITH JESUS":
    "https://images.unsplash.com/photo-1545989253-02cc26577f88?w=800&auto=format&fit=crop",
  "Opening Salvo Mass":
    "https://images.unsplash.com/photo-1519892338685-86566ba1f74b?w=800&auto=format&fit=crop",
  "Fiesta Señor Send-off Mass":
    "https://images.unsplash.com/photo-1548625361-58a9b86aa83b?w=800&auto=format&fit=crop",
  "WALK WITH MARY":
    "https://images.unsplash.com/photo-1519892338685-86566ba1f74b?w=800&auto=format&fit=crop",
  "Translation Mass":
    "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&auto=format&fit=crop",
  "Mananita Mass":
    "https://images.unsplash.com/photo-1548625149-720134d51a3a?w=800&auto=format&fit=crop",
  "Pontifical Mass":
    "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&auto=format&fit=crop",
  "Sinulog Fiesta Day Holy Mass":
    "https://images.unsplash.com/photo-1519892338685-86566ba1f74b?w=800&auto=format&fit=crop",
  HUBO: "https://images.unsplash.com/photo-1548625149-720134d51a3a?w=800&auto=format&fit=crop",

  // Cultural Shows & Festivals
  "Sinulog Open Style":
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
  "Cultural Show":
    "https://images.unsplash.com/photo-1551479460-5e76c686816a?w=800&auto=format&fit=crop",
  "Sinulog Idol":
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
  "SINULOG 2025 GRAND PARADE":
    "https://images.unsplash.com/photo-1551972873-b7e8754e8e26?w=800&auto=format&fit=crop",
  "Sinulog Launching Parade":
    "https://images.unsplash.com/photo-1551972873-b7e8754e8e26?w=800&auto=format&fit=crop",
  "Opening Ceremony":
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
  "Ceremonial Opening":
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
  "Opening Declaration":
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
  "Sinulog Festival Nightly Shows":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  "OSANino at 40 Exhibit":
    "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&auto=format&fit=crop",
  "Sto. Nino Exhibit":
    "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&auto=format&fit=crop",

  // Music & Performance
  "BRASS BAND PARADE":
    "https://images.unsplash.com/photo-1461784121038-f088ca1e7714?w=800&auto=format&fit=crop",
  "BRASS BAND COMPETITION":
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop",
  "FESTIVAL QUEEN":
    "https://images.unsplash.com/photo-1562347174-7370ad83dc47?w=800&auto=format&fit=crop",
  Concert:
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop",
  "KZ & Company Concert":
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop",
  "MISS CEBU 2025":
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
  "Party at the Parks":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  "Pocari Sweat DJ Performance":
    "https://images.unsplash.com/photo-1571266028243-3716f02d2f52?w=800&auto=format&fit=crop",
  "Bingo Plus Concert":
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop",

  // Sports & Activities
  "Sinulog Fun Run":
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop",
  "Cebu Marathon":
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop",
  "SINULOG OPEN STYLE BATTLE":
    "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&auto=format&fit=crop",
  "SINULOG DANCE CREW":
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop",
  "Balik Baroto Regatta":
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop",

  // Special Events
  "Balikbayan Welcome":
    "https://images.unsplash.com/photo-1513107358949-b21c1c3906eb?w=800&auto=format&fit=crop",
  "AWARDING CEREMONIES":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  "Mayors Night":
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&auto=format&fit=crop",
  "FLUVIAL PARADE":
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop",
  "Re-enactment of historical events":
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&auto=format&fit=crop",
  "DIY Influencers Event":
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format&fit=crop",
  "WILL TO WIN":
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop",
  "Pyrospectacular Show":
    "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&auto=format&fit=crop",
  "Video & Short Film Judging":
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop",
  "Photo Contest":
    "https://images.unsplash.com/photo-1480365501497-199581be0e66?w=800&auto=format&fit=crop",
  "SINULOG EXHIBITION":
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&auto=format&fit=crop",

  // Default categories with better images
  default_concert:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop",
  default_party:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  default_cultural:
    "https://images.unsplash.com/photo-1551479460-5e76c686816a?w=800&auto=format&fit=crop",
  default_religious:
    "https://images.unsplash.com/photo-1548625149-720134d51a3a?w=800&auto=format&fit=crop",
  default_competition:
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop",
  default_exhibition:
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1601823984263-b87b59798b70?w=800&auto=format&fit=crop",
};

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 10.3036, // Centered around Cebu City Sports Center
  lng: 123.9021,
};

const mapOptions = {
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
  ],
};

// Add this helper function at the top level
const normalizeVenueName = (venue: string): string => {
  return venue.toLowerCase().replace(/\s+/g, " ").trim();
};

// Add this function to find the closest matching venue
const findMatchingVenue = (searchVenue: string): string | null => {
  const normalizedSearch = normalizeVenueName(searchVenue);

  // First try exact match
  const exactMatch = Object.keys(venueCoordinates).find(
    (venue) => normalizeVenueName(venue) === normalizedSearch
  );
  if (exactMatch) return exactMatch;

  // Then try includes match
  const includesMatch = Object.keys(venueCoordinates).find(
    (venue) =>
      normalizeVenueName(venue).includes(normalizedSearch) ||
      normalizedSearch.includes(normalizeVenueName(venue))
  );
  if (includesMatch) return includesMatch;

  return null;
};

// Update the getEventImage function to be more flexible
const getEventImage = (eventName: string): string => {
  // Try exact match
  if (eventImages[eventName]) return eventImages[eventName];

  // Try case-insensitive match
  const lowerEventName = eventName.toLowerCase();
  const partialMatch = Object.keys(eventImages).find(
    (key) =>
      lowerEventName.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowerEventName)
  );
  if (partialMatch) return eventImages[partialMatch];

  // Return default based on event type
  if (lowerEventName.includes("concert") || lowerEventName.includes("music"))
    return eventImages.default_concert;
  if (lowerEventName.includes("party") || lowerEventName.includes("night"))
    return eventImages.default_party;
  if (
    lowerEventName.includes("cultural") ||
    lowerEventName.includes("festival") ||
    lowerEventName.includes("dance")
  )
    return eventImages.default_cultural;
  if (
    lowerEventName.includes("mass") ||
    lowerEventName.includes("religious") ||
    lowerEventName.includes("prayer")
  )
    return eventImages.default_religious;
  if (
    lowerEventName.includes("competition") ||
    lowerEventName.includes("contest")
  )
    return eventImages.default_competition;
  if (
    lowerEventName.includes("exhibit") ||
    lowerEventName.includes("exhibition")
  )
    return eventImages.default_exhibition;

  return eventImages.default;
};

// Update the time parsing helper functions
const parseEventTime = (time: string): number | null => {
  if (time === "TBA") return null;

  // Convert 12-hour format to 24-hour
  const [timeStr, period] = time.replace(/\s+/g, "").split(/(?=[AP]M)/i);
  let [hours, minutes] = timeStr.split(":").map(Number);

  if (period?.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (period?.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return hours;
};

// Update the event timing check functions
const isEventCurrent = (time: string): boolean => {
  const eventHour = parseEventTime(time);
  if (eventHour === null) return false;

  const currentHour = new Date().getHours();
  return Math.abs(eventHour - currentHour) <= 2; // Within 2 hours before or after
};

const isEventUpcoming = (time: string): boolean => {
  const eventHour = parseEventTime(time);
  if (eventHour === null) return false;

  const currentHour = new Date().getHours();
  return eventHour > currentHour;
};

// Add this type for event filter
type EventFilter = "current" | "upcoming" | "all";

// Add this helper function after other helper functions
const parseDate = (dateStr: string): Date => {
  const [month, dayStr, year] = dateStr.split(" ");
  const day = parseInt(dayStr.replace(",", ""));
  const monthIndex = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ].indexOf(month);

  return new Date(parseInt(year), monthIndex, day);
};

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState("JANUARY 20, 2025");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [eventFilter, setEventFilter] = useState<EventFilter>("current");

  // Update the dates array to include February
  const dates = [
    { label: "Jan 17", value: "JANUARY 17, 2025" },
    { label: "Jan 18", value: "JANUARY 18, 2025" },
    { label: "Jan 19", value: "JANUARY 19, 2025" },
    { label: "Jan 20", value: "JANUARY 20, 2025", isToday: true },
    { label: "Feb", value: "FEBRUARY 2025" },
  ];

  // Update the date filtering logic
  const dateFilteredSchedule = scheduleData.schedule.filter((item) => {
    // Handle single date
    if (item.date) {
      if (item.date === selectedDate) return true;

      // Handle "FEBRUARY 2025" format
      if (item.date.split(" ").length === 2) {
        const [itemMonth, itemYear] = item.date.split(" ");
        const [selectedMonth, selectedDay, selectedYear] =
          selectedDate.split(" ");
        return itemMonth === selectedMonth && itemYear === selectedYear;
      }
    }

    // Handle date ranges
    if (item.dateRange) {
      const [startDate, endDate] = item.dateRange.split(" - ");

      // Handle ranges like "JANUARY 10-20, 2025"
      if (startDate.includes("-")) {
        const [month, dayRange, year] = startDate.split(" ");
        const [startDay, endDay] = dayRange.split("-").map((d) => parseInt(d));
        const [selectedMonth, selectedDay, selectedYear] =
          selectedDate.split(" ");
        const currentDay = parseInt(selectedDay);

        return (
          month === selectedMonth &&
          year === selectedYear &&
          currentDay >= startDay &&
          currentDay <= endDay
        );
      }

      // Handle ranges like "DECEMBER 31, 2024 - JANUARY 1, 2025"
      const selectedDateObj = parseDate(selectedDate);
      const startDateObj = parseDate(startDate);
      const endDateObj = parseDate(endDate);

      return selectedDateObj >= startDateObj && selectedDateObj <= endDateObj;
    }

    return false;
  });

  // Update the filtering logic
  const filteredSchedule = dateFilteredSchedule
    .map((dateSchedule) => ({
      ...dateSchedule,
      events: dateSchedule.events.filter((event) => {
        // First apply search filter
        if (searchQuery) {
          const searchableText = [
            event.name,
            event.venue,
            event.time,
            event.note,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          if (!searchableText.includes(searchQuery.toLowerCase())) return false;
        }

        // Then apply time filter
        switch (eventFilter) {
          case "current":
            return isEventCurrent(event.time);
          case "upcoming":
            return isEventUpcoming(event.time);
          default:
            return true;
        }
      }),
    }))
    .filter((dateSchedule) => dateSchedule.events.length > 0);

  // Add this debug log to help track filtering
  console.log(
    "Filtered Schedule:",
    filteredSchedule.map((ds) =>
      ds.events.map((e) => ({
        name: e.name,
        time: e.time,
        isCurrent: isEventCurrent(e.time),
        isUpcoming: isEventUpcoming(e.time),
      }))
    )
  );

  // Get the current selected date object
  const currentDate =
    dates.find((date) => date.value === selectedDate) || dates[3];

  // Function to get unique venues from filtered schedule
  const getUniqueVenues = (schedule: typeof scheduleData.schedule) => {
    const venues = new Set<string>();
    schedule.forEach((dateSchedule) => {
      dateSchedule.events.forEach((event) => {
        if (
          event.venue &&
          event.venue !== "Venue to be announced" &&
          event.venue !== "TBA"
        ) {
          const matchedVenue = findMatchingVenue(event.venue);
          if (matchedVenue) {
            venues.add(matchedVenue);
          }
        }
      });
    });
    return Array.from(venues);
  };

  // Get markers for the map
  const getMarkers = (): Marker[] => {
    const uniqueVenues = getUniqueVenues(filteredSchedule);
    return uniqueVenues
      .map((venue) => findMatchingVenue(venue))
      .filter((venue): venue is string => venue !== null)
      .map((venue) => ({
        position: venueCoordinates[venue],
        title: venue,
        image:
          venueImages[venue] ||
          "https://lh5.googleusercontent.com/p/AF1QipMxDuGZcMu0rVaYy2UPkEXByWvTLOHxwB9nY1k=w408-h272-k-no",
        events: filteredSchedule.flatMap((dateSchedule) =>
          dateSchedule.events.filter((event) => {
            const eventVenueMatch = findMatchingVenue(event.venue);
            return eventVenueMatch === venue;
          })
        ),
      }));
  };

  // Update the findMarkerByVenue function
  const findMarkerByVenue = (venue: string): Marker | null => {
    const matchedVenue = findMatchingVenue(venue);
    if (!matchedVenue) return null;

    return {
      position: venueCoordinates[matchedVenue],
      title: matchedVenue,
      image:
        venueImages[matchedVenue] ||
        "https://lh5.googleusercontent.com/p/AF1QipMxDuGZcMu0rVaYy2UPkEXByWvTLOHxwB9nY1k=w408-h272-k-no",
      events: filteredSchedule.flatMap((dateSchedule) =>
        dateSchedule.events.filter((event) => {
          const eventVenueMatch = findMatchingVenue(event.venue);
          return eventVenueMatch === matchedVenue;
        })
      ),
    };
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Head>
        <title>One Beat, One Dance, One Vision</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-200 to-yellow-500 text-transparent bg-clip-text">
              Sinulog 2025
            </h1>
            <p className="text-lg text-zinc-400">
              One Beat, One Dance, One Vision
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, venues..."
                className="w-full p-4 pl-12 rounded-2xl bg-zinc-900/50 border border-zinc-800 
                text-zinc-100 placeholder-zinc-500 backdrop-blur-xl
                focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50
                transition-all duration-300"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 
                  hover:text-amber-500 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex flex-wrap justify-center gap-3">
            {dates.map((date) => (
              <button
                key={date.value}
                onClick={() => setSelectedDate(date.value)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${
                    selectedDate === date.value
                      ? "bg-amber-500 text-zinc-900"
                      : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
              >
                {date.label}
                {date.isToday && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-zinc-900/50">
                    Today
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Event Filter */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setEventFilter("current")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  eventFilter === "current"
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
                }`}
            >
              Current Events
            </button>
            <button
              onClick={() => setEventFilter("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  eventFilter === "upcoming"
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
                }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setEventFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  eventFilter === "all"
                    ? "bg-amber-500 text-zinc-900"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50"
                }`}
            >
              All Events
            </button>
          </div>

          {/* Event List and Map Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Events List */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-semibold text-zinc-100">
                  {currentDate.label}
                  {currentDate.isToday && (
                    <span className="ml-2 text-sm font-normal text-amber-500">
                      Today
                    </span>
                  )}
                </h2>
                {searchQuery && (
                  <div className="text-sm text-zinc-400 mt-2">
                    Showing results for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>

              <div className="divide-y divide-zinc-800">
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((dateSchedule, index) => (
                    <div
                      key={index}
                      className="p-6 hover:bg-zinc-800/30 transition-colors duration-200"
                    >
                      {dateSchedule.events.map((event, eventIndex) => (
                        <div
                          key={`${index}-${eventIndex}`}
                          className="mb-6 last:mb-0"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="flex-1 cursor-pointer group"
                              onClick={() => {
                                const marker = findMarkerByVenue(event.venue);
                                if (marker) {
                                  setSelectedMarker(marker);
                                  const map = document.querySelector(
                                    '[aria-label="Map"]'
                                  ) as HTMLElement;
                                  if (map)
                                    map.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                            >
                              <div className="flex gap-4">
                                <div className="relative w-16 h-16 flex-shrink-0">
                                  <Image
                                    src={getEventImage(event.name)}
                                    alt={event.name}
                                    fill
                                    className="rounded-lg object-cover"
                                    sizes="64px"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium text-zinc-100 group-hover:text-amber-400 transition-colors">
                                    {event.name}
                                  </h3>
                                  <p className="text-zinc-400 text-sm mt-1 group-hover:text-zinc-300 transition-colors">
                                    {event.venue}
                                  </p>
                                  <p className="text-sm text-amber-500 font-medium mt-1">
                                    {event.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-zinc-400">
                    {searchQuery
                      ? `No events found matching "${searchQuery}"`
                      : eventFilter === "current"
                      ? "No current events at this time"
                      : eventFilter === "upcoming"
                      ? "No upcoming events scheduled"
                      : "No events scheduled for this date"}
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden bg-zinc-900/50">
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={selectedMarker?.position || center}
                  zoom={selectedMarker ? 15 : 13}
                  options={{
                    ...mapOptions,
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onClick={() => setSelectedMarker(null)}
                >
                  {getMarkers().map((marker, index) => (
                    <Marker
                      key={`${marker.title}-${index}`}
                      position={marker.position}
                      title={marker.title}
                      icon={{
                        url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                      }}
                      onClick={() => setSelectedMarker(marker)}
                    />
                  ))}

                  {selectedMarker && (
                    <InfoWindow
                      position={selectedMarker.position}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="max-w-sm bg-white text-gray-900">
                        {/* Image Container */}
                        <div className="relative w-full h-48">
                          <Image
                            src={selectedMarker.image}
                            alt={selectedMarker.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 384px"
                            onError={() => {
                              const target = document.getElementById(
                                selectedMarker.title
                              ) as HTMLImageElement;
                              if (target) {
                                target.src =
                                  "https://lh5.googleusercontent.com/p/AF1QipMxDuGZcMu0rVaYy2UPkEXByWvTLOHxwB9nY1k=w408-h272-k-no";
                              }
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Title and Rating */}
                          <div className="mb-4">
                            <h3 className="text-[22px] font-normal text-gray-900 mb-1">
                              {selectedMarker.title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="flex items-center text-[#4285f4]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="ml-1 font-medium">4.4</span>
                                <span className="text-gray-600 ml-1">
                                  (10,638)
                                </span>
                              </span>
                              <span className="text-gray-600">•</span>
                              <span className="text-gray-600">
                                Historical landmark
                              </span>
                            </div>
                          </div>

                          {/* Tabs */}
                          <div className="border-b border-gray-200 mb-4">
                            <div className="flex gap-6 text-[14px]">
                              <button className="pb-2 text-[#1a73e8] border-b-2 border-[#1a73e8] font-medium">
                                Overview
                              </button>
                              <button className="pb-2 text-gray-600">
                                Events
                              </button>
                              <button className="pb-2 text-gray-600">
                                About
                              </button>
                            </div>
                          </div>

                          {/* Events List */}
                          <div className="space-y-4">
                            {selectedMarker.events.map((event, index) => (
                              <div key={index} className="flex gap-3">
                                <div className="relative w-12 h-12 flex-shrink-0">
                                  <Image
                                    src={getEventImage(event.name)}
                                    alt={event.name}
                                    fill
                                    className="rounded object-cover"
                                    sizes="48px"
                                  />
                                </div>
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">
                                    {event.name}
                                  </p>
                                  <p className="text-gray-600">{event.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-6">
                            <button className="flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                />
                              </svg>
                              Save
                            </button>
                            <button className="flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                                />
                              </svg>
                              Nearby
                            </button>
                            <button className="flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                                />
                              </svg>
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
