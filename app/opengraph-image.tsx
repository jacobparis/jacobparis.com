import { ImageResponse } from "next/og"

export const alt = "Jacob Paris"
export const size = {
	width: 1200,
	height: 600,
}
export const contentType = "image/png"

export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					backgroundColor: "#fafafa",
					color: "#404040",
					paddingTop: "64px",
					paddingLeft: "32px",
					paddingRight: "32px",
					fontSize: "32px",
				}}
			>
				{/* Title Section */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						marginLeft: "auto",
						marginRight: "auto",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
							paddingLeft: "64px",
							paddingRight: "64px",
							paddingTop: "32px",
							paddingBottom: "32px",
							textAlign: "center",
							alignItems: "center",
							maxWidth: "672px",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						<h2
							style={{
								fontSize: 48,
								fontWeight: 700,
								marginBottom: 0,
							}}
						>
							Jacob Paris
						</h2>
					</div>
				</div>

				{/* Browser Section */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						borderTopLeftRadius: "6px",
						borderTopRightRadius: "6px",
						paddingBottom: "192px",
						marginLeft: "auto",
						marginRight: "auto",
						position: "relative",
						overflow: "hidden",
						backgroundColor: "white",
						border: "1px solid #f5f5f5",
						boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
					}}
				>
					{/* Browser Header */}
					<div style={{ display: "flex", width: "600px" }}>
						<div style={{ display: "flex", paddingLeft: "12px" }}>
							<div
								style={{
									height: "12px",
									width: "12px",
									marginTop: "12px",
									marginRight: "4px",
									borderRadius: "9999px",
									border: "1px solid rgba(220, 38, 38, 0.3)",
									backgroundColor: "#ef4444",
								}}
							/>
							<div
								style={{
									height: "12px",
									width: "12px",
									marginTop: "12px",
									marginLeft: "4px",
									marginRight: "4px",
									borderRadius: "9999px",
									border: "1px solid rgba(202, 138, 4, 0.3)",
									backgroundColor: "#eab308",
								}}
							/>
							<div
								style={{
									height: "12px",
									width: "12px",
									marginTop: "12px",
									marginLeft: "4px",
									borderRadius: "9999px",
									border: "1px solid rgba(22, 163, 74, 0.3)",
									backgroundColor: "#22c55e",
								}}
							/>
						</div>
						<div
							style={{
								marginLeft: "auto",
								marginRight: "auto",
								backgroundColor: "rgba(163, 163, 163, 0.1)",
								marginTop: "8px",
								paddingLeft: "64px",
								paddingRight: "64px",
								paddingTop: "4px",
								paddingBottom: "4px",
								borderRadius: "4px",
								border: "1px solid rgba(163, 163, 163, 0.2)",
								fontSize: "12px",
							}}
						>
							jacobparis.com
						</div>
					</div>

					{/* Browser Content */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
							paddingLeft: "64px",
							paddingRight: "64px",
							paddingTop: "32px",
							paddingBottom: "32px",
							textAlign: "center",
							alignItems: "center",
							maxWidth: "672px",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						<p
							style={{
								color: "#404040",
								fontSize: 24,
								marginBottom: "48px",
								lineHeight: "2rem",
							}}
						>
							Articles, guides, and cheatsheets for building web applications
						</p>

						{/* Author */}
						<div
							style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
						>
							<div style={{ display: "flex" }}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									style={{ width: "64px", borderRadius: "9999px" }}
									src="https://jacobparis.com/images/jacob.png"
									alt=""
								/>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										paddingLeft: "16px",
										paddingRight: "16px",
										paddingTop: "4px",
										paddingBottom: "4px",
										fontSize: "16px",
									}}
								>
									<span style={{ fontWeight: 700, marginBottom: "4px" }}>Jacob Paris</span>
									<span style={{ color: "#737373" }}>@jacobmparis</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		),
		{
			...size,
		},
	)
}
