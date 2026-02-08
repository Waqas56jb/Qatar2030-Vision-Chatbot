import { useState } from 'react'

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'What is Qatar National Vision 2030?',
      answer: 'Qatar National Vision 2030 (QNV 2030) is a long-term national roadmap launched in 2008 under His Highness Sheikh Hamad bin Khalifa Al-Thani, the Father Emir of Qatar. It serves as a strategic framework to guide and balance economic growth with social well-being, human capital development, and environmental preservation. The Vision aims to transform Qatar into a prosperous, diversified, knowledge-based, sustainable, and inclusive society by 2030.',
    },
    {
      question: 'What are the four pillars of QNV 2030?',
      answer: 'QNV 2030 is structured around four integrated development pillars: 1) Economic Development - building a diversified, competitive, and sustainable economy; 2) Human Development - prioritizing investment in education, health, and workforce capabilities; 3) Social Development - strengthening social cohesion, cultural identity, and societal well-being; 4) Environmental Development - ensuring balance between growth and environmental sustainability.',
    },
    {
      question: 'What are the three National Development Strategies?',
      answer: 'Qatar developed three sequential development strategies to implement QNV 2030: NDS1 (2011-2016) laid foundations across all sectors; NDS2 (2018-2022) continued building with emphasis on diversification and sustainability; NDS3 (2024-2030) is the current strategy focusing on seven strategic outcomes including sustainable economic growth, fiscal sustainability, future-ready workforce, cohesive society, quality of life, environmental sustainability, and government excellence.',
    },
    {
      question: 'How does the chatbot work?',
      answer: 'Our chatbot uses a locally-hosted lightweight LLM (Large Language Model) that has been trained on the complete Qatar 2030 Vision knowledge base, including official NPC documents, all three NDS strategies, and related webpages. You can ask questions in natural language, and the AI will provide accurate answers based on official government documents and publications.',
    },
    {
      question: 'What information can I find using this chatbot?',
      answer: 'You can ask about Qatar\'s development goals, the four pillars of Vision 2030, the three National Development Strategies (NDS1, NDS2, NDS3), specific initiatives, strategic outcomes, numerical targets (like 4% non-hydrocarbon GDP growth, Top 10 digital competitiveness, $100B+ FDI attraction), diversification clusters, and any other topics related to Qatar National Vision 2030.',
    },
    {
      question: 'What are the key NDS3 targets for 2030?',
      answer: 'NDS3 includes ambitious targets such as: 4% non-hydrocarbon GDP growth, Top 10 Digital Competitiveness Index ranking, $100B+ FDI attraction, Top 15 Logistics Performance Index ranking, 85%+ government service satisfaction, 1.5% of GDP for R&D expenditure, and strengthening of seven strategic outcome areas.',
    },
    {
      question: 'Is the chatbot free to use?',
      answer: 'Yes, the chatbot is completely free to use. Simply create an account to start asking questions about Qatar 2030 Vision and access comprehensive information from official NPC documents and strategies.',
    },
    {
      question: 'How accurate are the answers?',
      answer: 'The chatbot is trained exclusively on official Qatar National Vision 2030 documents, all three National Development Strategies, NPC webpages, and verified government publications. All answers are sourced from these official documents, ensuring high accuracy and reliability.',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-accent-gold/5 to-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-accent-gold/20 rounded-full">
            <span className="text-black font-semibold">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Frequently Asked <span className="text-accent-gold">Questions</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Find answers to common questions about Qatar 2030 Vision and our chatbot
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="card border-2 border-transparent hover:border-accent-gold/30 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-xl font-bold text-black pr-8">{faq.question}</h3>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
