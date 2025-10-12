const GoogleButton = () => {
  return (
    <a
        href="https://play.google.com/store/apps/details?id=com.rafaelxulipa.simplebibleappmobile"
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full flex justify-center pb-4"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
          alt="Disponível no Google Play"
          className="h-12"
        />
    </a>
  );
};

export default GoogleButton;