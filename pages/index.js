import { signOut, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Modal from '../components/Modal';
import Widgets from '../components/Widgets';
import { modalState, modalTypeState } from '../atoms/modalAtom';
import { connectToDatabase } from '../util/mongodb';

export default function Home({ posts, articles }) {
  console.log('articles => ', articles);
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      router.push('/home');
    },
  });

  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);

  // console.log('session => ', session);
  // console.log('posts => ', posts);

  //! fix AnimatePresence Warning bug
  // const isBrowser = typeof window !== 'undefined';
  // if (!isBrowser) {
  //   return null;
  // }

  return (
    <div className="bg-[#F3F2EF] dark:bg-black dark:text-white h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>Feed | LinkedIn</title>
      </Head>

      <Header />

      <main className="flex justify-center gap-x-5 px-4 sm:px-12">
        <div className="flex flex-col md:flex-row gap-5 ">
          <Sidebar />
          <Feed posts={posts} />
        </div>

        <Widgets articles={articles} />

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Check if user is authenticated on the server...
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  //! Get Posts on SSR
  const { db } = await connectToDatabase();

  const posts = await db
    .collection('posts')
    .find()
    .sort({ timestamp: -1 })
    .toArray();

  //! Get Google News Api
  const results = await fetch(
    `https://newsapi.org/v2/top-headlines?country=id&apiKey=${process.env.NEWS_API_KEY}`
  ).then((res) => res.json());

  return {
    props: {
      session,
      articles: results.articles.slice(0, 5),
      posts: posts.map((post) => {
        delete post.timestamp;
        return {
          ...post,
          _id: post._id.toString(),
        };
      }),
    },
  };
}
