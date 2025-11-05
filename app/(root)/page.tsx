import WatchList from "@/components/WatchList";
import WatchOverview from "@/components/WatchOverview";
import {db} from "@/database/drizzle"
import { auth } from "@/auth";
import { desc } from "drizzle-orm";
import { watchs } from "@/database/schema";
import { Watch } from "@/types";

const Home = async () => {
    const session = await auth();

    const latestWatches = (await db.select().from(watchs).limit(5).orderBy(desc(watchs.createdAt))) as Watch[];

  return (
    <div className="space-y-16 py-16">
      <section className="container mx-auto px-4">
        <WatchOverview {...latestWatches[0]} userId={session?.user?.id}/>
      </section>

      <section className="container mx-auto px-4">
        <WatchList 
          name="Últimos Relojes"
          watches={latestWatches.slice(1)}
          className="mt-16"
        />
      </section>
    </div>
  );
}
export default Home;
