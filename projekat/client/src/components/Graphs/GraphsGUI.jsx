import React from 'react'; // Uvozimo React biblioteku za kreiranje komponente.
import { Pie, Bar } from 'react-chartjs-2'; // Uvozimo Pie i Bar grafove iz react-chartjs-2 biblioteke.
import useCharts from '../../hooks/useCharts'; // Uvozimo custom hook useCharts za dobijanje podataka za grafikone.

import './GraphsGUI.css'; // Uvozimo CSS fajl za stilizaciju komponenti.

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'; // Uvozimo potrebne elemente iz Chart.js biblioteke.

// Registrujemo Chart.js komponente.
ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
);

const GraphsGUI = () => { 
  // Definišemo funkcionalnu komponentu GraphsGUI.
  
  const { chartData, loading, error } = useCharts(); 
  // Koristimo custom hook useCharts za dobijanje podataka za grafikone. Uzimamo chartData, loading i error iz hook-a.

  // Mapiramo skraćenice berzanskih oznaka automobilskih brendova u puna imena.
  const stockLabelMap = {
    'TSLA': 'Tesla',
    'F': 'Ford',
    'GM': 'General Motors',
    'TM': 'Toyota',
    'BMWYY': 'BMW',
    'HMC': 'Honda',
    'HYMTF': 'Hyundai',
    'NSANY': 'Nissan',
    'VWAGY': 'Volkswagen',
    'MBGYY': 'Mercedes-Benz'
  };

  // Ako se grafikoni učitavaju, prikazujemo poruku.
  if (loading) return <div>Loading charts...</div>;

  // Ako je došlo do greške pri učitavanju, prikazujemo grešku.
  if (error) return <div>Error loading charts: {error}</div>;

  // Ažuriramo podatke za grafikon sa berzanskim cenama, zamenjujući skraćenice punim imenima brendova.
  const updatedStockBarData = {
    ...chartData.stockBarData, // Zadržavamo originalne podatke.
    labels: chartData.stockBarData.labels.map(ticker => stockLabelMap[ticker] || ticker) 
    // Zamenjujemo skraćenice (ticker) punim imenima iz mape stockLabelMap.
  };

  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}> 
      {/* Omotavajući div sa marginom gore i dole. */}
      <h1 className="header">Data Diagrams📊</h1> 
      {/* Prikazujemo naslov "Data Diagrams" sa emotikonom. */}

      <div className="graphs-container"> 
        {/* Kontejner za grafikone. */}
        <div className="graph-box">
          <h2 className="graph-title">Gender Distribution</h2> 
          {/* Naslov za pie grafikon: raspodela polova. */}
          <Pie
            data={chartData.pieData} 
            // Podaci za pie grafikon.
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: 'white'  // Postavljamo boju teksta legende na belu.
                  }
                }
              }
            }}
          />
        </div>

        <div className="bar-graph-box">
          <h2 className="graph-title">Number of Messages</h2> 
          {/* Naslov za bar grafikon: broj poruka. */}
          <Bar
            data={chartData.barData} 
            // Podaci za bar grafikon.
            options={{
              scales: {
                x: {
                  ticks: {
                    color: 'white'  // Postavljamo boju oznaka na x-osi na belu.
                  }
                },
                y: {
                  beginAtZero: true, 
                  // Y-osa počinje od nule.
                  ticks: {
                    color: 'white'  // Postavljamo boju oznaka na y-osi na belu.
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'white'  // Postavljamo boju teksta legende na belu.
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="graphs-container">
        <div className="bar-graph-box" style={{ marginTop: "30px", paddingBottom: "50px" }}>
          <h2 className="graph-title">Cars Data</h2> 
          {/* Naslov za bar grafikon: podaci o automobilima. */}
          <Bar
            data={chartData.carModelsBarData} 
            // Podaci za bar grafikon sa automobilima.
            options={{
              scales: {
                x: {
                  ticks: {
                    color: 'white'  // Postavljamo boju oznaka na x-osi na belu.
                  }
                },
                y: {
                  beginAtZero: true, 
                  // Y-osa počinje od nule.
                  ticks: {
                    color: 'white'  // Postavljamo boju oznaka na y-osi na belu.
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'white'  // Postavljamo boju teksta legende na belu.
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="graphs-container">
        <div className="bar-graph-box" style={{ marginTop: "30px", paddingBottom: "50px" }}>
          <h2 className="graph-title">Car Brand Stock Prices</h2> 
          {/* Naslov za bar grafikon: cene akcija automobilskih brendova. */}
          <Bar
            data={updatedStockBarData} 
            // Koristimo ažurirane podatke za berzanske cene sa punim imenima brendova.
            options={{
              scales: {
                x: {
                  ticks: {
                    color: 'white'  // Postavljamo boju oznaka na x-osi na belu.
                  }
                },
                y: {
                  beginAtZero: true, 
                  // Y-osa počinje od nule.
                  ticks: {
                    color: 'white'  // Postavljamo boju oznaka na y-osi na belu.
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: 'white'  // Postavljamo boju teksta legende na belu.
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphsGUI; 
// Eksportujemo komponentu GraphsGUI da bi mogla biti korišćena u drugim delovima aplikacije.
