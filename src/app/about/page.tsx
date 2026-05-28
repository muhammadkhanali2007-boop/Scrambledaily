export default function AboutPage() {
  return (
    <main className="px-6 py-[60px]">
      <article className="mx-auto w-full max-w-[680px]">
        <h1 className="mb-3 font-['Georgia'] text-[2rem] font-semibold leading-tight text-white">
          About ScrambleDaily
        </h1>

        <p className="mb-6 text-[17px] italic leading-[1.8] text-[#c9bfb8]">
          <strong className="font-semibold text-white">
            We built this because words deserve better.
          </strong>
        </p>

        <p className="mb-6 text-[17px] leading-[1.8] text-[#c9bfb8]">
          Most word tools online are slow, cluttered, and feel like they were designed to show
          ads first and help you second. We wanted something cleaner. Something that actually helps
          you get better with words -- and makes it fun while doing it.
        </p>

        <h2 className="mt-10 border-b border-[#3a3028] pb-2 font-['Georgia'] text-[1.3rem] font-semibold text-[#e8ddd6]">
          What We Built and Why
        </h2>

        <p className="mt-6 mb-3 text-[17px] leading-[1.8] text-[#c9bfb8]">
          <strong className="font-semibold text-white">
            The Daily Word Game -- Practice That Feels Like Play
          </strong>
        </p>
        <p className="mb-6 text-[17px] leading-[1.8] text-[#c9bfb8]">
          The home page game gives you scrambled words to solve, one at a time. What makes it
          different is the hints. Every word comes with progressive hints so you are not just
          guessing -- you are learning. You pick up patterns, discover new words, and get better
          without even realizing it. Easy, Medium, and Hard modes mean there is always the right
          level of challenge for you.
        </p>

        <p className="mb-3 text-[17px] leading-[1.8] text-[#c9bfb8]">
          <strong className="font-semibold text-white">
            Unscramble Tool -- Your Personal Word Lab
          </strong>
        </p>
        <p className="mb-6 text-[17px] leading-[1.8] text-[#c9bfb8]">
          Paste in any letters and instantly see every word hiding inside them. Use it when you
          are stuck. Use it to explore. Use it to practice on your own terms. No pressure, no
          timer -- just you and the words.
        </p>

        <p className="mb-3 text-[17px] leading-[1.8] text-[#c9bfb8]">
          <strong className="font-semibold text-white">
            Anagram Solver -- Same Letters, Different Word
          </strong>
        </p>
        <p className="mb-6 text-[17px] leading-[1.8] text-[#c9bfb8]">
          Give it a word and it finds every valid rearrangement using all the same letters. A
          different kind of challenge that sharpens how you see letter patterns. Great for
          practice, great for curiosity.
        </p>

        <p className="mb-3 text-[17px] leading-[1.8] text-[#c9bfb8]">
          <strong className="font-semibold text-white">
            Streak Challenge -- Compete With the World
          </strong>
        </p>
        <p className="mb-6 text-[17px] leading-[1.8] text-[#c9bfb8]">
          One scrambled word. 45 seconds. No hints. Solve it or your streak resets. The daily
          leaderboard lets you compare yourself against the best unscramble players from around the
          world. This is where your real potential shows.
        </p>

        <h2 className="mt-10 border-b border-[#3a3028] pb-2 font-['Georgia'] text-[1.3rem] font-semibold text-[#e8ddd6]">
          Who We Are
        </h2>

        <p className="mt-6 mb-6 text-[17px] leading-[1.8] text-[#c9bfb8]">
          We are a small passionate team. No big company behind this. Just people who genuinely
          believe that everyone has more word potential than they think -- and that the right
          practice, done the right way, can bring it out.
        </p>

        <p className="mb-6 text-[17px] leading-[1.8] text-[#c9bfb8]">
          ScrambleDaily is our attempt to build that place.
        </p>

        <h2 className="mt-10 border-b border-[#3a3028] pb-2 font-['Georgia'] text-[1.3rem] font-semibold text-[#e8ddd6]">
          Get in Touch
        </h2>

        <p className="mt-6 mb-4 text-[17px] leading-[1.8] text-[#c9bfb8]">
          Have a question, a suggestion, or want to report something? Our team reads every message
          and responds.
        </p>

        <p className="mb-6 text-[17px] leading-[1.8] text-[#c9bfb8]">
          <strong className="font-semibold text-white">Email: </strong>
          <a
            href="mailto:muhammadkhanali2007@gmail.com"
            className="font-bold text-[#c9a882] no-underline hover:underline"
          >
            muhammadkhanali2007@gmail.com
          </a>
        </p>

        <p className="text-[17px] italic leading-[1.8] text-[#8a7a70]">We are happy to hear from you.</p>
      </article>
    </main>
  );
}
