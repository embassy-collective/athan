import Prayers from '../molecules/prayers';
import Layout from '../templates/layout';

const Home = () => {
  const prayers = [
    {
      name: 'Fajr',
      time: '05:30',
      id: 'fajr'
    },
    {
      name: 'Sunrise',
      time: '06:30',
      id: 'sunrise'
    },
    {
      name: 'Dhuhr',
      time: '12:30',
      id: 'dhuhr'
    },
    {
      name: 'Asr',
      time: '15:30',
      id: 'asr'
    },
    {
      name: 'Maghrib',
      time: '18:30',
      id: 'maghrib'
    },
    {
      name: 'Isha',
      time: '20:30',
      id: 'isha'
    }
  ];
  return (
    <Layout>
      <div className="flex flex-row">
        <div className="flex flex-col gap-2 flex-grow">
          <h2 className="font-light text-3xl">
            Next prayer in <span className="text-accent">30:10</span>
          </h2>
          <h1 className="text-[112px]">
            <span className="font-black">Dhuhr</span> 12:30
          </h1>
          <p className="text-accent">5th Safar, 1445</p>
          <p className="text-accent">21st August, 2023</p>
        </div>
        <div>
          <div className="flex flex-row gap-2">
            <p>Select location</p>
            <img src="/images/icons/edit.svg" alt="location" className="w-6 h-6 text-accent" />
          </div>
        </div>
      </div>
      <Prayers prayers={prayers} className="mt-10">
        Today
      </Prayers>
      <Prayers prayers={prayers} className="mt-10">
        Tomorrow
      </Prayers>
    </Layout>
  );
};

export default Home;
