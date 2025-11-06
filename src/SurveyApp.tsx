import {useState} from 'react'
import {ChevronRight, Share2} from 'lucide-react'
import emailjs from '@emailjs/browser'
import './SurveyApp.css'

interface Option {
    label: string
    text: string
    value: number
}

interface Question {
    id: number
    title: string
    image: string
    options: Option[]
}

interface ResultType {
    label: string
    desc: string
}

type stageType = 'intro' | 'info' | 'survey' | 'result'

const emailOptions = {
    publicKey: import.meta.env.VITE_EMAIL_SERVICE_PUBLIC_KEY,
    blockHeadless: true,
    limitRate: {
        throttle: 5000
    }
}

const SurveyApp = () => {
    const [stage, setStage] = useState<stageType>('intro')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [score, setScore] = useState(0)
    const [gender, setGender] = useState<string>('')
    const [ageGroup, setAgeGroup] = useState<string>('')

    const questions: Question[] = [
        {
            id: 1,
            title: "회사 채용 공고에 '여성 우대'가 표기됐다. 당신 반응은?",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q1",
            options: [
                {label: "A", text: "정책 취지·통계 확인 후 의견 제시", value: 0},
                {label: "B", text: "형평·합법성 고려", value: 1},
                {label: "C", text: "역차별·능력주의 주장", value: 2},
                {label: "D", text: "조롱 밈 공유", value: 3}
            ]
        },
        {
            id: 2,
            title: "군가산점 부활 국민청원",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q2",
            options: [
                {label: "A", text: "대체복무/보상 패키지로 논의", value: 0},
                {label: "B", text: "형평성 논의", value: 1},
                {label: "C", text: "당장 부활 주장", value: 2},
                {label: "D", text: "군 가산점 반대 측을 조롱하며 적극 찬성 동의", value: 3}
            ]
        },
        {
            id: 3,
            title: "커뮤니티에 여성 비하 밈이 올라왔다",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q3",
            options: [
                {label: "A", text: "신고 및 차단", value: 0},
                {label: "B", text: "무대응/넘김", value: 1},
                {label: "C", text: "표현의 자유로 옹호", value: 2},
                {label: "D", text: "가담·확산", value: 3}
            ]
        },
        {
            id: 4,
            title: "여대 남녀 공학 전환 논쟁",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q4",
            options: [
                {label: "A", text: "학생·동문 의견 듣고 안전/시설부터 점검", value: 0},
                {label: "B", text: "공개 토론·총투표 등 절차로 결정하자", value: 1},
                {label: "C", text: "그냥 바로 남녀공학 가자(여대 필요 없음)", value: 2},
                {label: "D", text: "여대 폐지를 주장하며, 학생들을 공격함", value: 3}
            ]
        },
        {
            id: 5,
            title: "데이트 비용·더치 논쟁",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q5",
            options: [
                {label: "A", text: "합의·소득 차 반영", value: 0},
                {label: "B", text: "상황별 번갈아 계산", value: 1},
                {label: "C", text: "남성 부담이 관습, 보상 받아야", value: 2},
                {label: "D", text: "시대착오 조롱 콘텐츠 제작", value: 3}
            ]
        },
        {
            id: 6,
            title: "여성가족부 '기능 재편' 기사",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q6",
            options: [
                {label: "A", text: "타 부처 분산·성과지표 재설계", value: 0},
                {label: "B", text: "한시적 시범 후 평가", value: 1},
                {label: "C", text: "즉시 폐지", value: 2},
                {label: "D", text: "혐오 밈으로 공격", value: 3}
            ]
        },
        {
            id: 7,
            title: "데이트폭력 기사",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q7",
            options: [
                {label: "A", text: "피해자 보호·절차적 정의 동시 고려", value: 0},
                {label: "B", text: "수사 결과 기다림", value: 1},
                {label: "C", text: "무고 의심부터 제기", value: 2},
                {label: "D", text: "피해자 조롱/2차가해", value: 3}
            ]
        },
        {
            id: 8,
            title: "'여성 전용' 공모전 세션",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q8",
            options: [
                {label: "A", text: "장벽 높은 분야의 교정적 조치로 이해", value: 0},
                {label: "B", text: "기간·분야 한정 조건부 허용", value: 1},
                {label: "C", text: "역차별·남성 소외", value: 2},
                {label: "D", text: "운영진 조롱·불매", value: 3}
            ]
        },
        {
            id: 9,
            title: "단톡방 여성 외모 품평 논란",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q9",
            options: [
                {label: "A", text: "사과·재발방지 룰 제정", value: 0},
                {label: "B", text: "논란 터진 단톡방을 없애라고 주장", value: 1},
                {label: "C", text: "장난이라며 과민 반응 지적", value: 2},
                {label: "D", text: "해당 사건을 조롱성 공격으로 2차 가해 가담", value: 3}
            ]
        },
        {
            id: 10,
            title: "정치인 \"젠더갈등은 언론의 산물\" 발언",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q10",
            options: [
                {label: "A", text: "구조·세대·플랫폼 요인 복합론", value: 0},
                {label: "B", text: "부분 동의 + 실증요구", value: 1},
                {label: "C", text: "언론 탓이 전부", value: 2},
                {label: "D", text: "좌표찍기로 언론 공격", value: 3}
            ]
        },
        {
            id: 11,
            title: "지하철 '여성전용칸' 확대 논쟁",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q11",
            options: [
                {label: "A", text: "혼잡·안전 데이터 보고, 피크시간 한정 시범 + 혼잡완화 패키지로 묶자", value: 0},
                {label: "B", text: "공론화/지표(이용률·범죄율) 기준으로 기간 제한 시험 후 재평가", value: 1},
                {label: "C", text: "전용칸은 역차별이니 즉시 폐지", value: 2},
                {label: "D", text: "빈칸 특권 밈으로 조롱", value: 3}
            ]
        },
        {
            id: 12,
            title: "알고리즘이 극단적 남초 채널을 추천",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q12",
            options: [
                {label: "A", text: "신고하고, 차단", value: 0},
                {label: "B", text: "시청하되 팩트체크", value: 1},
                {label: "C", text: "내 경험과 같아 전폭 수용", value: 2},
                {label: "D", text: "클립 편집·확산", value: 3}
            ]
        },
        {
            id: 13,
            title: "\"페미니즘은 남녀의 동등한 권리·기회를 지향한다\" 발표가 있었다. 당신의 반응은?",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q13",
            options: [
                {label: "A", text: "적극 동의하고 보완자료 제시", value: 0},
                {label: "B", text: "대체로 동의, 추가 데이터 요청", value: 1},
                {label: "C", text: "동의 어렵고 역차별 우려 제기", value: 2},
                {label: "D", text: "여성우월이라며 비판·조롱", value: 3}
            ]
        },
        {
            id: 14,
            title: "\"페미니즘이 한국 여성의 지위 향상에 기여했다\"는 기사 토론",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q14",
            options: [
                {label: "A", text: "동의, 구체 사례 언급", value: 0},
                {label: "B", text: "일부 동의, 분야별 차이 지적", value: 1},
                {label: "C", text: "기여 적음/의문 제기", value: 2},
                {label: "D", text: "전혀 아니며 오히려 해악 주장", value: 3}
            ]
        },
        {
            id: 15,
            title: "회의 중 누군가 \"페미니즘은 여성을 피해자로만 본다\"고 말했다",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q15",
            options: [
                {label: "A", text: "왜곡이라 반박하고 정의·맥락 설명", value: 0},
                {label: "B", text: "과장된 표현이라 정정 요구", value: 1},
                {label: "C", text: "일정 부분 사실이라며 수긍", value: 2},
                {label: "D", text: "전적으로 동의하고 확산", value: 3}
            ]
        },
        {
            id: 16,
            title: "커뮤니티에 \"페미니즘=여성우월주의\" 밈이 돌 때 당신은?",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q16",
            options: [
                {label: "A", text: "잘못된 프레이밍 지적·근거 제시", value: 0},
                {label: "B", text: "과한 일반화라며 자제 요청", value: 1},
                {label: "C", text: "어느 정도 맞다는 취지로 공유", value: 2},
                {label: "D", text: "적극 가담·확산", value: 3}
            ]
        },
        {
            id: 17,
            title: "지인이 \"너 스스로 페미니스트라 생각해?\"라고 물었다",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q17",
            options: [
                {label: "A", text: "그렇다", value: 0},
                {label: "B", text: "용어는 피하지만 성평등 가치는 지지", value: 1},
                {label: "C", text: "용어·운동 모두 불편해 거리 둠", value: 2},
                {label: "D", text: "페미 자체에 강한 거부감 표출", value: 3}
            ]
        },
        {
            id: 18,
            title: "직장에서 '성평등 주간' 캠페인 제안이 올라왔다",
            image: "https://via.placeholder.com/375x300/6B7280/ffffff?text=Q18",
            options: [
                {label: "A", text: "적극 참여·주변 참여 독려", value: 0},
                {label: "B", text: "시간 허락 시 참여", value: 1},
                {label: "C", text: "불필요/효과 회의적", value: 2},
                {label: "D", text: "반대 의견 표명·조롱 콘텐츠 제작", value: 3}
            ]
        }
    ]

    const getResultType = (score: number): ResultType => {
        if (score <= 25) return {
            label: "개방형",
            desc: "다양한 관점을 존중하며 성평등 이슈에 개방적인 태도를 보입니다. 대화와 이해를 중시하는 성향입니다."
        }
        if (score <= 50) return {
            label: "신중형",
            desc: "성평등 이슈에 신중하게 접근하며 균형잡힌 시각을 유지하려 노력합니다. 상황에 따라 유연한 판단을 보입니다."
        }
        if (score <= 75) return {
            label: "방어형",
            desc: "성평등 이슈에 경계심을 갖고 있으며 역차별에 대한 우려가 있습니다. 현재 구조에 대한 불만을 표현합니다."
        }
        return {label: "대립형", desc: "성평등 담론에 강한 반감을 보이며 대립적 태도를 취합니다. 극단적 표현이나 조롱에 동조하는 경향이 있습니다."}
    }

    const handleAnswer = (questionId: number, value: number) => {
        setAnswers(prev => ({...prev, [questionId]: value}))
    }

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            calculateScore()
        }
    }

    const calculateScore = () => {
        const total = Object.values(answers).reduce((sum: number, val: number) => sum + val, 0)
        const finalScore = Math.round((total / (3 * questions.length)) * 100)
        setScore(finalScore)
        setStage('result')
    }

    const sendEmail = async () => {
        const resultType = getResultType(score)

        const answersDetail = questions.map(q => {
            const answerValue = answers[q.id]
            const selectedOption = q.options.find(opt => opt.value === answerValue)
            if (!selectedOption) return ''
            return `Q${q.id}. ${q.title}\n답변: ${selectedOption.label}. ${selectedOption.text}`
        }).join('\n\n')

        const templateParams = {
            title: '설문',
            fromName: '설문참여자',
            time: new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'}),
            message: `성별: ${gender}\n연령대: ${ageGroup}\n총 점수: ${score}\n결과 유형: ${resultType.label}\n\n상세 답변:\n${answersDetail}`,
            email: 'jina940323@noreply.com'
        }

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAIL_SERVICE_ID,
                import.meta.env.VITE_EMAIL_SERVICE_TEMPLATE_ID,
                templateParams,
                import.meta.env.VITE_EMAIL_SERVICE_PUBLIC_KEY
            )
            alert('결과가 이메일로 전송되었습니다!')
        } catch (error) {
            console.error('이메일 전송 실패:', error)
            alert('이메일 전송에 실패했습니다. 다시 시도해주세요.')
        }
    }

    const handleShare = async () => {
        const resultType = getResultType(score)
        const text = `젠더 인식 설문 결과: ${resultType.label} (${score}점)`

        if (navigator.share) {
            try {
                await navigator.share({title: '젠더 인식 설문', text, url: window.location.href})
            } catch {
                console.log('공유 취소됨')
            }
        } else {
            alert('이 브라우저는 공유 기능을 지원하지 않습니다.')
        }
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100
    const currentQ = questions[currentQuestion]
    const isAnswered = answers[currentQ?.id] !== undefined

    if (stage === 'intro') {
        return (
            <div className="survey-center-container">
                <div className="survey-card">
                    <h1 className="intro-title">
                        젠더 인식 설문조사
                    </h1>
                    <div className="intro-description">
                        <p>본 설문은 성평등 이슈에 대한 인식을 파악하기 위한 조사입니다.</p>
                        <p>소요시간은 약 5분이며, 모든 응답은 익명으로 처리됩니다.</p>
                        <p>총 18개 문항으로 구성되어 있습니다.</p>
                    </div>
                    <button
                        onClick={() => setStage('info')}
                        className="btn-primary"
                    >
                        시작하기
                        <ChevronRight size={20}/>
                    </button>
                </div>
            </div>
        )
    }

    if (stage === 'info') {
        return (
            <div className="survey-center-container">
                <div className="survey-card">
                    <h1 className="intro-title">
                        기본 정보 입력
                    </h1>
                    <div className="intro-description">
                        <p>설문 진행을 위해 기본 정보를 선택해주세요.</p>
                    </div>

                    <div style={{ marginTop: '2rem', width: '100%' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                                성별
                            </h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {['남성', '여성', '기타', '선택 안 함'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setGender(option)}
                                        className={`option-button ${gender === option ? 'option-button-selected' : ''}`}
                                        style={{ flex: '1 1 calc(50% - 0.375rem)', minWidth: '120px' }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                                연령대
                            </h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {['10대', '20대', '30대', '40대', '50대 이상'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setAgeGroup(option)}
                                        className={`option-button ${ageGroup === option ? 'option-button-selected' : ''}`}
                                        style={{ flex: '1 1 calc(50% - 0.375rem)', minWidth: '120px' }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setStage('survey')}
                        disabled={!gender || !ageGroup}
                        className={gender && ageGroup ? 'btn-primary' : 'btn-disabled'}
                        style={{ marginTop: '1rem' }}
                    >
                        설문 시작하기
                        <ChevronRight size={20}/>
                    </button>
                </div>
            </div>
        )
    }

    if (stage === 'result') {
        const resultType = getResultType(score)
        return (
            <div className="survey-center-container">
                <div className="survey-card">
                    <div className="result-score">
                        <div className="result-score-number">{score}</div>
                        <div className="result-type">
                            {resultType.label}
                        </div>
                        <p className="result-description">
                            {resultType.desc}
                        </p>
                    </div>
                    <div className="button-group">
                        <button
                            onClick={handleShare}
                            className="btn-primary"
                        >
                            <Share2 size={20}/>
                            결과 공유하기
                        </button>
                        <button
                            onClick={sendEmail}
                            className="btn-secondary"
                        >
                            이메일로 전송
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    emailjs.init(emailOptions)

    return (
        <div className="survey-container">
            <div className="progress-header">
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{width: `${progress}%`}}/>
                </div>
                <div className="progress-text">
                    {currentQuestion + 1} / {questions.length}
                </div>
            </div>

            <div className="question-container">
                <div className="question-card">
                    <img
                        src={currentQ.image}
                        alt={`질문 ${currentQ.id}`}
                        className="question-image"
                    />

                    <div className="question-content">
                        <h2 className="question-title">
                            {currentQ.title}
                        </h2>

                        <div className="options-container">
                            {currentQ.options.map((option) => (
                                <button
                                    key={option.label}
                                    onClick={() => handleAnswer(currentQ.id, option.value)}
                                    className={`option-button ${
                                        answers[currentQ.id] === option.value
                                            ? 'option-button-selected'
                                            : ''
                                    }`}
                                >
                                    <span
                                        className="option-label">{option.label}.</span> {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bottom-nav">
                <div className="bottom-nav-inner">
                    <button
                        onClick={handleNext}
                        disabled={!isAnswered}
                        className={isAnswered ? 'btn-primary' : 'btn-disabled'}
                    >
                        {currentQuestion < questions.length - 1 ? '다음' : '결과 보기'}
                        <ChevronRight size={20}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SurveyApp
