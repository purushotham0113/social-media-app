// src/components/Logo.jsx
export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            {/* Logo Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="w-10 h-10 drop-shadow-md"
            >
                <defs>
                    <linearGradient id="lynqGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F58529" />
                        <stop offset="25%" stopColor="#DD2A7B" />
                        <stop offset="50%" stopColor="#8134AF" />
                        <stop offset="100%" stopColor="#515BD4" />
                    </linearGradient>
                </defs>

                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#lynqGradient)" strokeWidth="5" />
                <text
                    x="50%"
                    y="60%"
                    textAnchor="middle"
                    fontSize="38"
                    fontFamily="Poppins, sans-serif"
                    fontWeight="900"
                    fill="url(#lynqGradient)"
                >
                    LQ
                </text>
            </svg>

            {/* Brand Name */}
            {/* <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                Lynq
            </h1> */}
        </div>
    );
}
