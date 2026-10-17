export function setupHeader() {
	const header = document.querySelector("header");

	function updateHeight() {
		document.documentElement.style.setProperty(
			"--header-height",
			header.offsetHeight + "px",
		);
	}

	updateHeight();
	window.addEventListener("resize", updateHeight);

	let lastY = window.scrollY;
	window.addEventListener("scroll", () => {
		const y = window.scrollY;
		if (Math.abs(y - lastY) < 5) return;

		if (y > lastY && y > header.offsetHeight) {
			document.body.classList.add("header-hidden");
		} else {
			document.body.classList.remove("header-hidden");
		}

		lastY = y;
	});

	header.addEventListener("focusin", () => {
		document.body.classList.remove("header-hidden");
	});
}