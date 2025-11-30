import React from 'react';
import styled from 'styled-components';
import { Card, PageHeader, PageTitle, PageSubtitle } from './SharedStyles';

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const BlogSection = styled(Card)`
  margin-bottom: 30px;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;

  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h2`
  color: #2e7d32;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #2e7d32, #4caf50);
    border-radius: 2px;
  }
`;

const SectionContent = styled.div`
  color: #475569;
  line-height: 1.7;
  font-size: 16px;

  p {
    margin-bottom: 16px;
  }

  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
  }

  strong {
    color: #1e293b;
    font-weight: 600;
  }

  em {
    color: #64748b;
    font-style: italic;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
  border: 2px solid #2e7d32;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
  font-weight: 600;
  color: #1b5e20;
  font-size: 18px;
`;

const QuoteBox = styled.blockquote`
  background: #f8fafc;
  border-left: 4px solid #2e7d32;
  padding: 20px 24px;
  margin: 20px 0;
  font-style: italic;
  color: #475569;
  font-size: 16px;
  border-radius: 0 8px 8px 0;
`;

const WarningBox = styled.div`
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 2px solid #d97706;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  color: #92400e;
  font-weight: 600;
`;

const InfoBox = styled.div`
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
  border: 2px solid #0284c7;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  color: #0c4a6e;
  font-weight: 600;
`;

const Blog: React.FC = () => {
  return (
    <>
      <PageHeader>
        <div>
          <PageTitle>🌿 Blog de ÁGORA</PageTitle>
          <PageSubtitle>Información, consejos y todo sobre salud mental para jóvenes</PageSubtitle>
        </div>
      </PageHeader>

      <BlogContainer>
        <BlogSection>
          <SectionTitle>🌿 SOBRE NOSOTROS – ¿Qué es ÁGORA?</SectionTitle>
          <SectionContent>
            <p>
              <strong>Ágora</strong> es una plataforma digital creada por estudiantes del CETis 41 con el objetivo de brindar apoyo emocional,
              información confiable y herramientas de autocuidado a jóvenes entre 14 y 18 años. Buscamos romper el silencio alrededor de la salud mental,
              ofrecer un espacio seguro y crear una comunidad donde puedas hablar sin miedo, aprender, reflexionar y sentirte acompañado.
            </p>
            <QuoteBox>
              Ágora no es un consultorio, ni un diagnóstico médico.<br />
              Es un puente entre tú y tu bienestar, un lugar donde encuentras claridad, calma y comprensión.
            </QuoteBox>
            <p>
              En este blog comunicaremos todo acerca de ágora para que siempre estén informados tanto del avance como de la información
              estructurada preparada para todos.
            </p>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>✨ PROPÓSITO DE ÁGORA</SectionTitle>
          <SectionContent>
            <p>Nuestro propósito es brindar un espacio donde cada joven pueda:</p>
            <ul>
              <li>Comprender mejor sus emociones.</li>
              <li>Identificar señales de alerta.</li>
              <li>Expresarse sin miedo, de manera anónima.</li>
              <li>Acceder a información confiable sobre salud mental.</li>
              <li>Aprender herramientas para autocuidarse.</li>
              <li>Encontrar acompañamiento de una comunidad que los entiende.</li>
              <li>Conectar con centros de apoyo profesional si lo necesitan.</li>
            </ul>
            <HighlightBox>
              Ágora nace porque tu mente también importa.<br />
              Tu bienestar es importante.<br />
              Tu historia vale.
            </HighlightBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🧠 SALUD MENTAL PARA JÓVENES: LO QUE NADIE TE EXPLICA</SectionTitle>
          <SectionContent>
            <p>
              La salud mental abarca emociones, pensamientos, comportamientos, autoestima, manejo del estrés y relaciones sociales.
              No es solo "sentirte feliz"; es saber equilibrar tu mundo interno y entender que estar mal también es parte del proceso.
            </p>
            <p>Los jóvenes de hoy enfrentan:</p>
            <ul>
              <li>Ansiedad por tareas, exámenes y presión académica.</li>
              <li>Estrés por problemas familiares.</li>
              <li>Comparación constante en redes sociales.</li>
              <li>Problemas de autoestima.</li>
              <li>Acoso y comentarios dañinos.</li>
              <li>Falta de comunicación con adultos.</li>
              <li>Confusión emocional.</li>
            </ul>
            <InfoBox>
              Y Ágora está aquí para ayudarte a navegar todo eso.
            </InfoBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🚨 SEÑALES DE ALERTA EMOCIONAL QUE NO DEBES IGNORAR</SectionTitle>
          <SectionContent>
            <WarningBox>
              <ul style={{ textAlign: 'left', margin: 0 }}>
                <li>Cansancio emocional constante</li>
                <li>Pensamientos repetitivos o negativos</li>
                <li>Aislamiento</li>
                <li>Insomnio</li>
                <li>Falta de concentración</li>
                <li>Irritabilidad</li>
                <li>Cambios bruscos de ánimo</li>
                <li>Sentir que nada importa</li>
                <li>Pérdida de interés en cosas que antes te gustaban</li>
              </ul>
            </WarningBox>
            <QuoteBox>
              Reconocer estas señales NO te hace débil.<br />
              Te hace fuerte, valiente y consciente.
            </QuoteBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>📱 REDES SOCIALES Y SALUD MENTAL: EL IMPACTO REAL</SectionTitle>
          <SectionContent>
            <p>Las redes sociales pueden ser una herramienta increíble, pero también pueden dañar:</p>

            <h3 style={{ color: '#2e7d32', marginTop: '20px' }}>Efectos positivos</h3>
            <ul>
              <li>Conexión con amigos</li>
              <li>Expresión creativa</li>
              <li>Información útil</li>
              <li>Sentirse parte de una comunidad</li>
            </ul>

            <h3 style={{ color: '#d97706', marginTop: '20px' }}>Efectos negativos</h3>
            <ul>
              <li>Comparación constante</li>
              <li>Ansiedad por likes</li>
              <li>Ciberacoso</li>
              <li>Presión por "ser perfecto"</li>
              <li>Dependencia o adicción digital</li>
            </ul>

            <InfoBox>
              Ágora te enseña a usar redes sociales de forma sana, equilibrada y consciente.
            </InfoBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>💛 AUTOESTIMA EN ADOLESCENTES: CÓMO CUIDARLA</SectionTitle>
          <SectionContent>
            <p>La autoestima es la forma en la que te ves a ti mismo. Se fortalece cuando:</p>
            <ul>
              <li>Te hablas con amabilidad</li>
              <li>Te rodeas de personas que suman</li>
              <li>Reconoces tus capacidades</li>
              <li>Aceptas tus emociones</li>
              <li>Te permites equivocarte</li>
            </ul>

            <WarningBox>
              Tu valor NO depende: de tu físico, tu celular, tus seguidores o tus calificaciones.
            </WarningBox>

            <HighlightBox>
              Tú vales por lo que eres.
            </HighlightBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>😣 ANSIEDAD Y ESTRÉS ESCOLAR: CÓMO MANEJARLOS</SectionTitle>
          <SectionContent>
            <p>
              La ansiedad no es "ser dramático". Es un sistema de alerta activado cuando te sientes presionado.
            </p>

            <h3 style={{ color: '#2e7d32', marginTop: '20px' }}>Estrategias para manejarla:</h3>
            <ul>
              <li>Respiración profunda (4-7-8)</li>
              <li>Ejercicios de relajación</li>
              <li>Dividir tus tareas</li>
              <li>Dormir suficiente</li>
              <li>Hablar con alguien de confianza</li>
              <li>Pausas activas entre estudio</li>
            </ul>

            <InfoBox>
              Ágora incluye ejercicios, meditaciones y técnicas para ayudarte cada día.
            </InfoBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🤝 RELACIONES INTERPERSONALES: AMIGOS, FAMILIA Y LÍMITES</SectionTitle>
          <SectionContent>
            <p>Las relaciones pueden ser fuente de calma… o de estrés.</p>

            <p>En Ágora aprenderás:</p>
            <ul>
              <li>Cómo poner límites sin sentir culpa</li>
              <li>Cómo comunicar lo que sientes</li>
              <li>Señales de una amistad sana</li>
              <li>Señales de una relación tóxica</li>
              <li>Cómo manejar discusiones</li>
              <li>Cómo pedir apoyo emocional</li>
            </ul>

            <QuoteBox>
              Es valiente hablar. Es valiente pedir ayuda.
            </QuoteBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🌿 HÁBITOS SALUDABLES PARA MENTE Y CUERPO</SectionTitle>
          <SectionContent>
            <ul>
              <li>Dormir de 7 a 9 horas</li>
              <li>Comer de forma equilibrada</li>
              <li>Mantenerte hidratado</li>
              <li>Hacer actividad física ligera</li>
              <li>Tener rutinas de descanso</li>
              <li>Desconectarte del celular</li>
              <li>Hablar de tus emociones</li>
              <li>Tener tiempo para hobbies</li>
            </ul>

            <HighlightBox>
              Tu cuerpo está conectado con tu mente.<br />
              Si cuidas uno, el otro mejora.
            </HighlightBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>⚠ ADICCIONES EN JÓVENES: INFORMACIÓN QUE NECESITAS</SectionTitle>
          <SectionContent>
            <p>Las adicciones no son solo sustancias. También pueden ser:</p>
            <ul>
              <li>Celular</li>
              <li>Redes sociales</li>
              <li>Videojuegos</li>
              <li>Comida</li>
              <li>Apuestas</li>
              <li>Relación de pareja</li>
              <li>Estímulos emocionales</li>
            </ul>

            <p>Ágora quiere ayudarte a reconocer:</p>
            <ul>
              <li>Qué es una adicción</li>
              <li>Cómo evitarla</li>
              <li>Cómo manejarla</li>
              <li>Dónde pedir ayuda</li>
              <li>Cómo apoyar a alguien que está pasando por eso</li>
            </ul>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🎭 PRESIÓN SOCIAL Y ACADÉMICA</SectionTitle>
          <SectionContent>
            <p>La mayoría de los jóvenes cargan presiones invisibles:</p>
            <ul>
              <li>Ser el mejor</li>
              <li>No fallar</li>
              <li>Dar gusto a todos</li>
              <li>No decepcionar</li>
              <li>Buscar aprobación</li>
              <li>Mantener una imagen "perfecta"</li>
            </ul>

            <InfoBox>
              Ágora ofrece un espacio seguro donde no necesitas fingir.
            </InfoBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🧘 TÉCNICAS DE AUTOCUIDADO</SectionTitle>
          <SectionContent>
            <ul>
              <li>Respiración consciente</li>
              <li>Meditación guiada</li>
              <li>Mindfulness</li>
              <li>Journaling (diario emocional)</li>
              <li>Pausas activas</li>
              <li>Mover el cuerpo</li>
              <li>Música relajante</li>
              <li>Afirmaciones positivas</li>
            </ul>

            <InfoBox>
              Ágora trae cada técnica explicada paso a paso.
            </InfoBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🆘 CÓMO PEDIR AYUDA SIN MIEDO</SectionTitle>
          <SectionContent>
            <p>Pedir ayuda es una habilidad emocional. Puedes hablar con:</p>
            <ul>
              <li>Psicólogos</li>
              <li>Maestros</li>
              <li>Amigos de confianza</li>
              <li>Familiares</li>
              <li>Tutores</li>
              <li>Orientadores escolares</li>
            </ul>

            <InfoBox>
              Ágora también te conecta con centros de apoyo cercanos.
            </InfoBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🌬️ MINDFULNESS, RELAJACIÓN Y RESPIRACIÓN</SectionTitle>
          <SectionContent>
            <p>Técnicas disponibles en Ágora:</p>
            <ul>
              <li>Respiración 4-7-8</li>
              <li>Respiración en caja</li>
              <li>Meditación de 1 minuto</li>
              <li>Mindfulness de sonidos</li>
              <li>Escaneo corporal</li>
              <li>Relajación muscular progresiva</li>
              <li>Cuaderno emocional</li>
              <li>Técnicas rápidas para exámenes</li>
            </ul>

            <InfoBox>
              Cada ejercicio es práctico, juvenil y guiado.
            </InfoBox>
          </SectionContent>
        </BlogSection>

        <BlogSection>
          <SectionTitle>🌟 MENSAJE FINAL PARA TI</SectionTitle>
          <SectionContent>
            <HighlightBox>
              Tu salud mental importa.<br />
              No tienes que cargar todo solo.<br />
              No tienes que fingir que estás bien.<br />
              No eres débil por sentir.<br />
              No eres raro por tener ansiedad.<br />
              No estás solo.
            </HighlightBox>

            <QuoteBox>
              Ágora existe porque tú existes.<br />
              Para acompañarte.<br />
              Para escucharte.<br />
              Para darte herramientas.<br />
              Para recordarte que tu historia apenas comienza.
            </QuoteBox>
          </SectionContent>
        </BlogSection>
      </BlogContainer>
    </>
  );
};

export default Blog;