import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import {
  Bell,
  Calendar,
} from "lucide-react";

function LatestAnnouncements() {

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {

    async function fetchAnnouncements() {

      const q = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc"),
        limit(3)
      );

      const snapshot = await getDocs(q);

      setAnnouncements(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

    }

    fetchAnnouncements();

  }, []);

  return (

    <div className="card-theme rounded-2xl shadow-md p-6">

      <div className="flex items-center gap-3 mb-5">

        <Bell className="primary-text"/>

        <h2 className="text-2xl font-bold">

          Latest Announcements

        </h2>

      </div>

      {announcements.length===0 ? (

        <p className="text-theme-muted">

          No announcements available.

        </p>

      ) : (

        <div className="space-y-5">

          {announcements.map(item=>(

            <div
              key={item.id}
              className="border-l-4 border-blue-600 pl-4"
            >

              <h3 className="font-semibold">

                {item.title}

              </h3>

              <p className="text-theme-muted mt-1">

                {item.message}

              </p>

              <div className="flex items-center gap-2 mt-2 text-sm text-theme-muted">

                <Calendar size={15}/>

                {item.createdAt?.toDate().toLocaleDateString()}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default LatestAnnouncements;