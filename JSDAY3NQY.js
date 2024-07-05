
const apiKey = "eyJ4NXQiOiJOak16WWpreVlUZGlZVGM0TUdSalpEaGtaV1psWWpjME5UTXhORFV4TlRZM1ptRTRZV1JrWWc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJzZjM1MzM4NkBjYWxseXdpdGguYWMudWtAY2FyYm9uLnN1cGVyIiwiYXBwbGljYXRpb24iOnsib3duZXIiOiJzZjM1MzM4NkBjYWxseXdpdGguYWMudWsiLCJ0aWVyUXVvdGFUeXBlIjpudWxsLCJ0aWVyIjoiVW5saW1pdGVkIiwibmFtZSI6InNpdGVfc3BlY2lmaWMtNTljYWQ1ZWItZjVmMC00Y2FhLTk2M2QtZDUzNDk3OTdmNDQ3IiwiaWQiOjUxNjgsInV1aWQiOiIxMzgzYzE4MC05MjJhLTQwZDctYjRhMS01ZjJjYzA2OGUyNzcifSwiaXNzIjoiaHR0cHM6XC9cL2FwaS1tYW5hZ2VyLmFwaS1tYW5hZ2VtZW50Lm1ldG9mZmljZS5jbG91ZDo0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJ3ZGhfc2l0ZV9zcGVjaWZpY19mcmVlIjp7InRpZXJRdW90YVR5cGUiOiJyZXF1ZXN0Q291bnQiLCJncmFwaFFMTWF4Q29tcGxleGl0eSI6MCwiZ3JhcGhRTE1heERlcHRoIjowLCJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOiJzZWMifX0sImtleXR5cGUiOiJQUk9EVUNUSU9OIiwic3Vic2NyaWJlZEFQSXMiOlt7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiU2l0ZVNwZWNpZmljRm9yZWNhc3QiLCJjb250ZXh0IjoiXC9zaXRlc3BlY2lmaWNcL3YwIiwicHVibGlzaGVyIjoiSmFndWFyX0NJIiwidmVyc2lvbiI6InYwIiwic3Vic2NyaXB0aW9uVGllciI6IndkaF9zaXRlX3NwZWNpZmljX2ZyZWUifV0sInRva2VuX3R5cGUiOiJhcGlLZXkiLCJpYXQiOjE3MjAxMDEzODEsImp0aSI6ImI2YmIzYWM1LTBmYTAtNDg1Yy04ZmU3LWQyZTdhZmE1ZjI3MyJ9.NWuml60Zr8CkO0hzQvFkBQlJY4pmTolpkRiDWAFoZ2qYvLe_rTjEXxs5Yf3BtMdt1fPubmSvX5vYAoB3nSTLgtuIZSyr8uY5hpPZ5168IvtoE7vAc_E-YsF0uqaiRPqaTvf5EizvKl1w3eimlnJwfscsDDrgSFXxC6risbvBxUBQCi7CpKFPK_mJqvockzYWAI804VdozRx1Fz8ZxeEtG_fevzb66MC_etiPBidAKWYJgl4ZmjcYnEWdaiElVs8NxTrwMkA1rYeOO1npesDbtKl5vTXHfdIKq9lQzuLCScoEUgIeSSmu59wniW6ZVSHdK9nsbxHp_JdN7epGGHFC2w==";
const apiURL = "https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/hourly?latitude=50.56956000&longitude=-4.91759000";
async function fetchData() {
    try {
        const response = await fetch(apiURL, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataJson = await response.json();
        console.log('Data fetched successfully:', dataJson);

        // Ensure dataJson is in the expected structure
        if (!dataJson || !dataJson.features || dataJson.features.length === 0) {
            throw new Error('Invalid data format or no data available');
        }

        // Extract relevant data
        const observations = dataJson.features[0]?.properties?.timeSeries;

        if (!observations || observations.length === 0) {
            throw new Error('No observations data available');
        }

        // Extracting data for the next few hours
        const nextFewHours = observations.slice(0, 12); // Assuming next 6 data points (adjust as needed)

        // Prepare data for the chart
        const labels = nextFewHours.map(obs => obs.time.split('T')[1].substring(0, 5)); 
        const temperatures = nextFewHours.map(obs => obs.screenTemperature.toFixed(2));
        const windSpeed = nextFewHours.map(obs => obs.windSpeed10m.toFixed(2));
        const windDirection = nextFewHours.map(obs => obs.windDirectionFrom10m.toFixed(0));
        const windGust = nextFewHours.map(obs => obs.windGustSpeed10m.toFixed(0));
        const humidity = nextFewHours.map(obs => obs.screenRelativeHumidity.toFixed(0));
        const visibility = nextFewHours.map(obs => obs.visibility.toFixed(0));
        const rain = nextFewHours.map(obs => obs.probOfPrecipitation.toFixed(0));
        
        // Display data on the webpage
        const latestObservation = nextFewHours[nextFewHours.length - 1];
        displayWeatherData('temperature', latestObservation.screenTemperature.toFixed(1));
        displayWeatherData('windSpeed', latestObservation.windSpeed10m.toFixed(2));
        displayWeatherData('windDirection', latestObservation.windDirectionFrom10m.toFixed(0));
        displayWeatherData('windGust', latestObservation.windGustSpeed10m.toFixed(2));
        displayWeatherData('humidity', latestObservation.screenRelativeHumidity.toFixed(0));
        displayWeatherData('visibility', latestObservation.visibility.toFixed(0));
        updateArrowDirection(latestObservation.windDirectionFrom10m);
        
        // Render chart
        renderChart(labels, temperatures);
        renderChart2(labels, windSpeed)
        renderChart3(labels,windGust)
        renderChart4(labels, humidity)
        renderChart5(labels, visibility)
        renderChart6(labels,rain)

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again later.');
    }
}

function displayWeatherData(elementId, data) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = data;
    } else {
        console.error(`Element with id ${elementId} not found`);
    }
}

function renderChart(labels, data) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    const weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: data,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: false,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}
function renderChart2(labels, data) {
    const ctx = document.getElementById('weatherChart2').getContext('2d');
    const weatherChart2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wind Speed (mph)',
                data: data,
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: false,//DO NOT MAKE TRUE !!SHRINKING GRAPHS!!//
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Wind Speed (mph)'
                    }
                }
            }
        }
    });
}

function renderChart3(labels, data) {
    const ctx = document.getElementById('weatherChart3').getContext('2d');
    const weatherChart3 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wind Gust (m/s)',
                data: data,
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: false,//DO NOT MAKE TRUE !!SHRINKING GRAPHS!!//
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Wind Gust (m/s)'
                    }
                }
            }
        }
    });
}

function updateArrowDirection(degrees) {
    const arrow = document.getElementById('arrow');
    arrow.style.transform = `translate(-50%, -100%) rotate(${degrees}deg)`;
}
function renderChart4(labels, data) {
    const ctx = document.getElementById('weatherChart4').getContext('2d');
    const weatherChart4 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: data,
                borderColor: 'rgba(255, 152, 255, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: false,//DO NOT MAKE TRUE !!SHRINKING GRAPHS!!//
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    }
                }
            }
        }
    });
}

function renderChart5(labels, data) {
    const ctx = document.getElementById('weatherChart5').getContext('2d');
    const weatherChart5 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Visibility (metres)',
                data: data,
                borderColor: 'rgba(50, 50, 55, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: false,//DO NOT MAKE TRUE !!SHRINKING GRAPHS!!//
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Visibility (metres)'
                    }
                }
            }
        }
    });
}
function renderChart6(labels, data) {
    const ctx = document.getElementById('weatherChart6').getContext('2d');
    const weatherChart6 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Probability of Rain (%)',
                data: data,
                borderColor: 'rgba(255, 81, 0, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: false,//DO NOT MAKE TRUE !!SHRINKING GRAPHS!!//
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Probability of Rain (%)'
                    }
                }
            }
        }
    });
}
fetchData();

