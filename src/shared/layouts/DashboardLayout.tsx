export const DashboardLayout = () => {
	return (
		<div className="grid min-h-dvh grid-cols-1 grid-rows-1 bg-black">
			<div className="flex h-full w-full flex-col">
				<header className="h-[64px] w-full bg-red-500"></header>
				<div className="flex h-full w-full flex-col bg-blue-500 md:flex-row">
					<aside className="hidden h-full bg-violet-600 md:flex md:min-w-[260px]"></aside>
					<main className="flex h-full w-full flex-col">
						<div className="h-[68px] w-full bg-slate-600"></div>
						<article className="h-full w-full bg-yellow-300"></article>
					</main>
				</div>
			</div>
		</div>
	);
};
