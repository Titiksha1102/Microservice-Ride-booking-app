$paths = @(
    "C:\Users\mtitiksha\OneDrive - Computer Enterprises Inc\node projects\uber clone application\User Service",
    "C:\Users\mtitiksha\OneDrive - Computer Enterprises Inc\node projects\uber clone application\Captain Service",
    "C:\Users\mtitiksha\OneDrive - Computer Enterprises Inc\node projects\uber clone application\Ride Service"
)

foreach ($path in $paths) {
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd `"$path`"; while (`$true) { npm start; Start-Sleep 2 }`"" -WindowStyle Normal
}
