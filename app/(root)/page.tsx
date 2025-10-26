import WatchList from "@/components/WatchList";
import WatchOverview from "@/components/WatchOverview";
import { sampleWatches } from "@/app/constants";
import {db} from "@/database/drizzle"
import {users} from "@/database/schema"


const Home = async () => {
    //onst result = await db.select().from(users)
    //console.log(result)
  return (
    <>
    <WatchOverview { ...sampleWatches[0]}/>

    <WatchList 
      name="Ultimos Relojes"
      watches={sampleWatches}
      containerClassName="mt-28"
      />
    </>
  );
}
export default Home;
