import { useState, useEffect, useRef } from 'react'
import './HomePage.css'

// 导入文章内容组件
import BackViewContent from '../components/back-view/Content.jsx'
import GuxiangContent from '../components/guxiang/Content.jsx'
import FarewellContent from '../components/farewell-to-cambridge/Content.jsx'

// ============ 常量定义 ============

const APP_STATES = {
  INITIAL: 'initial',      // 书籍关闭，初始状态
  OPENING: 'opening',      // 打开书籍动画中
  BOOK: 'book',            // 书籍打开，显示封面
  SWITCHING: 'switching',  // 切换封面动画中
  CLOSING: 'closing',      // 关闭书籍动画中
  LOADING: 'loading',      // 加载内容中
  CONTENT: 'content'       // 查看内容详情
}

const ANIMATION_CONFIG = {
  OPENING_DURATION: 200,
  OPENING_FRAME_INTERVAL: 50,
  SWITCHING_DURATION: 200,
  SWITCHING_FRAME_INTERVAL: 66,
  LOAD_TIMEOUT: 10000,
  ERROR_DISPLAY_DURATION: 3000
}

const CONTENTS = [
  {
    id: 'article1',
    title: '背影',
    coverImage: '/back-view.webp',
    Component: BackViewContent
  },
  {
    id: 'article2',
    title: '故乡',
    coverImage: '/rentu.webp',
    Component: GuxiangContent
  },
  {
    id: 'article3',
    title: '再别康桥',
    coverImage: '/farewell-to-cambridge.webp',
    Component: FarewellContent
  }
  // 可以添加更多内容
]

// ============ HomePage 组件 ============

const HomePage = () => {
  // === 状态机 ===
  const [appState, setAppState] = useState(APP_STATES.INITIAL)

  // === 内容管理 ===
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [contents] = useState(CONTENTS)

  // === 动画控制 ===
  const [frame, setFrame] = useState(0)
  const [switchDirection, setSwitchDirection] = useState(null) // 'next' | 'prev'

  // === 3D 透视（INITIAL 和 BOOK 状态需要） ===
  const [transform, setTransform] = useState({ rotateY: 0, rotateX: 0 })

  // === 布局变换（书籍居中和缩放） ===
  const [layoutTransform, setLayoutTransform] = useState({ x: 0, y: 0, scale: 1 })

  // === 错误处理 ===
  const [loadError, setLoadError] = useState(null)

  // === 视觉反馈 ===
  const [isBookHovered, setIsBookHovered] = useState(false)

  // === 图片加载状态 ===
  const [loadedImages, setLoadedImages] = useState({}) // 记录已加载的图片
  const [nextPageLoading, setNextPageLoading] = useState(false) // 翻页时下一页图片是否加载中

  // === 渐进式加载状态 ===
  const [isInitialLoading, setIsInitialLoading] = useState(true) // 全屏 loading
  const [backgroundLoaded, setBackgroundLoaded] = useState(false) // 背景是否加载完
  const [bookAssetsLoaded, setBookAssetsLoaded] = useState(false) // book 动画是否加载完

  // === Refs ===
  const containerRef = useRef(null)
  const anchorRef = useRef(null)
  const iframeRef = useRef(null)
  const animationTimerRef = useRef(null)
  const loadTimeoutRef = useRef(null)
  const imageLoadTimeoutRef = useRef({}) // 记录每个图片的加载超时

  // ============ Helper Functions ============

  // 预加载图片
  const preloadImage = (imagePath) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const timeout = setTimeout(() => {
        reject(new Error(`Image load timeout: ${imagePath}`))
      }, 8000) // 8秒超时

      img.onload = () => {
        clearTimeout(timeout)
        setLoadedImages(prev => ({ ...prev, [imagePath]: true }))
        resolve()
      }

      img.onerror = () => {
        clearTimeout(timeout)
        reject(new Error(`Failed to load image: ${imagePath}`))
      }

      img.src = imagePath
    })
  }

  // 获取下一页内容索引
  const getNextContentIndex = (direction) => {
    if (direction === 'next') {
      return (currentContentIndex + 1) % contents.length
    } else if (direction === 'prev') {
      return (currentContentIndex - 1 + contents.length) % contents.length
    }
    return currentContentIndex
  }

  // 注意：CLOSING 状态不包含在这里，以便允许用户在关闭过程中再次点击打开（打断关闭）
  const isAnimating = appState === APP_STATES.OPENING || appState === APP_STATES.SWITCHING

  const getCurrentContent = () => contents[currentContentIndex] || null

  const shouldShowContent = () => {
    // 在 frame 4 时显示内容，此时旋转已归零
    return (appState === APP_STATES.BOOK || appState === APP_STATES.LOADING || appState === APP_STATES.OPENING) && frame >= 4
  }

  const getRotateZ = () => {
    // 翻页动画不需要 Z 轴旋转（开书动画的 Z 轴逻辑会干扰翻页）
    if (appState === APP_STATES.SWITCHING) return 0
    if (frame === 4) return 0
    return (frame / 3) * 15
  }

  // ============ 事件处理器 - 状态转换 ============

  const handleClickBook = (e) => {
    e.stopPropagation()

    // 允许在 INITIAL 状态或 CLOSING 状态（打断关闭）点击
    if (appState !== APP_STATES.INITIAL && appState !== APP_STATES.CLOSING) return

    // 转换到 OPENING 状态
    setAppState(APP_STATES.OPENING)
    setFrame(0)
  }

  const handleOpeningComplete = () => {
    if (appState !== APP_STATES.OPENING) return
    setAppState(APP_STATES.BOOK)
  }

  const handleSwitchContent = async (direction) => {
    if (appState !== APP_STATES.BOOK) return

    const nextIndex = getNextContentIndex(direction)
    if (nextIndex === currentContentIndex) return

    // 检查下一页的图片是否已加载
    const nextContent = contents[nextIndex]
    const isImageLoaded = loadedImages[nextContent.coverImage]

    if (!isImageLoaded) {
      // 图片还没加载，先加载
      setNextPageLoading(true)
      try {
        await preloadImage(nextContent.coverImage)
      } catch (err) {
        console.warn(`Failed to load next page image:`, err)
        // 即使加载失败也继续翻页（显示不出来就不出来）
      } finally {
        setNextPageLoading(false)
      }
    }

    // 开始翻页动画
    setSwitchDirection(direction)
    setAppState(APP_STATES.SWITCHING)
    setFrame(0)
  }

  const handleSwitchingComplete = () => {
    if (appState !== APP_STATES.SWITCHING) return

    let nextIndex
    if (switchDirection === 'next') {
      nextIndex = (currentContentIndex + 1) % contents.length
    } else if (switchDirection === 'prev') {
      nextIndex = (currentContentIndex - 1 + contents.length) % contents.length
    }

    setCurrentContentIndex(nextIndex)
    setAppState(APP_STATES.BOOK)
    setFrame(4)
    setSwitchDirection(null)
  }

  const handleViewContent = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }

    if (appState !== APP_STATES.BOOK) return

    // 内联组件直接切换到CONTENT状态，无需加载过程
    setAppState(APP_STATES.CONTENT)
  }

  const handleLoadSuccess = () => {
    if (appState !== APP_STATES.LOADING) return

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }

    setAppState(APP_STATES.CONTENT)
  }

  const handleLoadError = (errorMessage) => {
    if (appState !== APP_STATES.LOADING) return

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = null
    }

    setLoadError(errorMessage || '加载失败，请重试')
    setAppState(APP_STATES.BOOK)

    // 3s 后自动清除错误
    setTimeout(() => {
      setLoadError(null)
    }, ANIMATION_CONFIG.ERROR_DISPLAY_DURATION)
  }

  const handleCloseContent = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }

    if (appState !== APP_STATES.CONTENT) return

    setAppState(APP_STATES.BOOK)
  }

  const handleCloseBook = () => {
    if (appState !== APP_STATES.BOOK) return

    // 直接重置 layout，CSS transition 会处理平滑移动
    setLayoutTransform({ x: 0, y: 0, scale: 1 })
    setAppState(APP_STATES.CLOSING)
    // frame 将在 useEffect 中从 4 递减到 0
  }

  const handleBackgroundClick = () => {
    if (appState === APP_STATES.BOOK) {
      handleCloseBook()
    } else if (appState === APP_STATES.CONTENT) {
      handleCloseContent(new Event('click'))
    }
  }

  // ============ 事件处理器 - 输入反馈 ============

  const handleBookMouseEnter = () => {
    if (appState === APP_STATES.INITIAL) {
      setIsBookHovered(true)
      setFrame(1)
    }
  }

  const handleBookMouseLeave = () => {
    setIsBookHovered(false)
    if (appState === APP_STATES.INITIAL) {
      setFrame(0)
    }
  }

  // ============ Effects - 动画系统 ============

  // 计算打开动画的目标参数
  const openingTargetRef = useRef(null)

  useEffect(() => {
    if (appState !== APP_STATES.OPENING) return

    if (!anchorRef.current) return

    const rect = anchorRef.current.getBoundingClientRect()
    const targetHeight = window.innerHeight * 0.9
    const targetScale = targetHeight / rect.height

    const targetX = window.innerWidth / 2
    const targetY = window.innerHeight / 2
    const currentX = rect.left + rect.width / 2
    const currentY = rect.top + rect.height / 2

    const x = targetX - currentX
    const y = targetY - currentY

    // 使用 requestAnimationFrame 确保过渡从当前状态平滑开始，避免突变
    // 先确保当前帧是初始状态
    requestAnimationFrame(() => {
      setLayoutTransform({ x, y, scale: targetScale })
    })
  }, [appState])

  // 移除了基于 frame 更新 layoutTransform 的 useEffect，改为 CSS 动画

  // OPENING 动画帧计时器
  useEffect(() => {
    if (appState !== APP_STATES.OPENING) return

    const frameInterval = ANIMATION_CONFIG.OPENING_FRAME_INTERVAL
    let currentFrame = 0

    const timer = setInterval(() => {
      currentFrame++
      setFrame(currentFrame)

      if (currentFrame >= 4) {
        clearInterval(timer)
        handleOpeningComplete()
      }
    }, frameInterval)

    return () => clearInterval(timer)
  }, [appState])

  // CLOSING 动画帧计时器
  useEffect(() => {
    if (appState !== APP_STATES.CLOSING) return

    const frameInterval = ANIMATION_CONFIG.OPENING_FRAME_INTERVAL
    let currentFrame = 4

    const timer = setInterval(() => {
      currentFrame--
      setFrame(currentFrame)

      if (currentFrame <= 0) {
        clearInterval(timer)
        setAppState(APP_STATES.INITIAL)
        setFrame(0)
      }
    }, frameInterval)

    return () => clearInterval(timer)
  }, [appState])

  // SWITCHING 动画
  useEffect(() => {
    if (appState !== APP_STATES.SWITCHING) return

    const frameInterval = 100 // Speed updated to 80ms by user request
    const totalFrames = 5 // 0, 1, 2, 3, 4

    // Initial frame depends on direction
    // If next: start at 0, go to 4
    // If prev: start at 4, go to 0
    let currentFlipIndex = switchDirection === 'next' ? 0 : totalFrames - 1

    // Set initial frame immediately
    setFrame(currentFlipIndex)

    const timer = setInterval(() => {
      if (switchDirection === 'next') {
        currentFlipIndex++
      } else {
        currentFlipIndex--
      }

      // Check bounds
      const isFinished = switchDirection === 'next'
        ? currentFlipIndex >= totalFrames
        : currentFlipIndex < 0

      if (isFinished) {
        clearInterval(timer)
        handleSwitchingComplete()
      } else {
        setFrame(currentFlipIndex)
      }
    }, frameInterval)

    return () => clearInterval(timer)
  }, [appState, switchDirection])

  // 3D 透视追踪（INITIAL 和 BOOK 状态）
  useEffect(() => {
    if (appState !== APP_STATES.INITIAL && appState !== APP_STATES.BOOK) return

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth) - 0.5
      const y = (e.clientY / innerHeight) - 0.5

      const rotateY = x * 10
      const rotateX = -y * 6

      setTransform({ rotateY, rotateX })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [appState])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating) return

      if (appState === APP_STATES.BOOK) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          handleSwitchContent('prev')
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          handleSwitchContent('next')
        } else if (e.key === 'Enter') {
          e.preventDefault()
          handleViewContent(e)
        } else if (e.key === 'Escape') {
          e.preventDefault()
          handleCloseBook()
        }
      } else if (appState === APP_STATES.CONTENT) {
        if (e.key === 'Escape') {
          e.preventDefault()
          handleCloseContent(e)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [appState, isAnimating])

  // 窗口大小调整处理
  useEffect(() => {
    const handleResize = () => {
      if ((appState === APP_STATES.BOOK || appState === APP_STATES.CONTENT) && layoutTransform.scale > 1) {
        // 如果书籍已展开，重新计算位置
        if (!anchorRef.current) return
        const rect = anchorRef.current.getBoundingClientRect()
        const targetHeight = window.innerHeight * 0.9
        const scale = targetHeight / rect.height

        const targetX = window.innerWidth / 2
        const targetY = window.innerHeight / 2
        const currentX = rect.left + rect.width / 2
        const currentY = rect.top + rect.height / 2

        const x = targetX - currentX
        const y = targetY - currentY

        setLayoutTransform({ x, y, scale })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [appState, layoutTransform.scale])

  // 渐进式加载：背景 → Book 动画 → 完成
  useEffect(() => {
    const progressiveLoad = async () => {
      try {
        // 第一步：加载背景
        await preloadImage('/table.webp')
        setBackgroundLoaded(true)

        // 第二步：并行加载 book 动画帧和第一个内容封面
        const bookFrames = [
          preloadImage('/book-0.webp'),
          preloadImage('/book-1.webp'),
          preloadImage('/book-2.webp'),
          preloadImage('/book-3.webp'),
          preloadImage('/book-4.webp'),
          preloadImage(contents[0]?.coverImage) // 第一个内容的封面
        ]
        await Promise.all(bookFrames.map(p => p.catch(() => {}))) // 忽略错误

        // 第三步：加载翻页动画帧
        const flipFrames = [
          preloadImage('/fanye-0.webp'),
          preloadImage('/fanye-1.webp'),
          preloadImage('/fanye-2.webp'),
          preloadImage('/fanye-3.webp'),
          preloadImage('/fanye-4.webp')
        ]
        await Promise.all(flipFrames.map(p => p.catch(() => {}))) // 忽略错误

        // 所有关键资源加载完成
        setBookAssetsLoaded(true)
        setIsInitialLoading(false)
      } catch (err) {
        console.error('Progressive loading error:', err)
        // 即使出错也继续显示页面
        setBookAssetsLoaded(true)
        setIsInitialLoading(false)
      }
    }

    progressiveLoad()
  }, [contents])

  // 后台预加载所有内容的大背景图（不阻塞主流程）
  useEffect(() => {
    const preloadContentAssets = async () => {
      try {
        // 动态导入并预加载每个内容组件的大背景图
        const assetImports = [
          import('../components/back-view/back-view.webp').then(m => m.default),
          import('../components/guxiang/runtu.webp').then(m => m.default),
          import('../components/guxiang/cha.webp').then(m => m.default),
          import('../components/farewell-to-cambridge/farewell-to-cambridge.webp').then(m => m.default),
          import('../components/farewell-to-cambridge/gold-cambridge.webp').then(m => m.default),
          import('../components/back-view/orange.webp').then(m => m.default),
          import('../components/farewell-to-cambridge/branch.webp').then(m => m.default)
        ]

        const imageUrls = await Promise.all(assetImports.map(p => p.catch(() => null)))

        // 预加载所有图片
        const preloadPromises = imageUrls
          .filter(url => url)
          .map(url => preloadImage(url).catch(err => {
            console.warn(`Failed to preload asset: ${url}`, err)
          }))

        await Promise.all(preloadPromises)
        console.log('Content assets preloaded successfully')
      } catch (err) {
        console.warn('Error preloading content assets:', err)
      }
    }

    // 在 book 动画加载完成后立即开始预加载内容资源
    if (bookAssetsLoaded) {
      preloadContentAssets()
    }
  }, [bookAssetsLoaded])

  // 后台预加载所有内容的封面图片（不阻塞主流程）
  useEffect(() => {
    const preloadAllImages = async () => {
      const imagePromises = contents.map(content =>
        preloadImage(content.coverImage).catch(err => {
          console.warn(`Failed to preload image: ${content.coverImage}`, err)
          // 失败不中断，继续加载其他图片
        })
      )
      await Promise.all(imagePromises)
    }

    // 延迟预加载，不打断主要加载流程
    const timer = setTimeout(() => {
      preloadAllImages()
    }, 500)

    return () => clearTimeout(timer)
  }, [contents])

  // 清理工作 - 组件卸载时
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
      }
      Object.values(imageLoadTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout)
      })
    }
  }, [])

  // ============ CSS 类名计算 ============

  const getBookContainerClasses = () => {
    const classes = ['book-container']

    if (isAnimating) {
      classes.push('animating')
    }

    if (appState === APP_STATES.INITIAL) {
      classes.push('breathing')
    }

    if (appState === APP_STATES.BOOK && isBookHovered) {
      classes.push('hover-enhanced')
    }

    return classes.join(' ')
  }

  // ============ 渲染 ============

  // 全屏 loading 覆盖层（初始加载）
  // 当背景加载完成后，强制隐藏，无论其他资源是否加载完
  const renderInitialLoading = () => {
    if (!isInitialLoading || backgroundLoaded) return null
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    )
  }

  // 浮动 loading（背景已加载，但 book 动画还未加载完）- 使用底部指示器而非蒙层
  const renderProgressLoading = () => {
    if (isInitialLoading || bookAssetsLoaded || !backgroundLoaded) return null
    return (
      <div className="page-loading-indicator">
        <div className="loading-spinner"></div>
        <span>准备中...</span>
      </div>
    )
  }

  return (
    <div className="home-page" ref={containerRef} onClick={handleBackgroundClick}>
      {/* 全屏 loading（仅在初始加载阶段显示） */}
      {renderInitialLoading()}

      {/* 背景加载完成后显示，但可能有浮动 loading */}
      {backgroundLoaded && (
        <>
          {/* 背景场景 */}
          <div className="image-container">
            <img
              src="/table.webp"
              alt="Table"
              className="table-image"
            />

            {/* 书籍容器 - 始终渲染，但在 CONTENT 状态下可能被 overlay 遮挡 */}
            <div className="book-anchor" ref={anchorRef}>
              <div
                className={getBookContainerClasses()}
                onClick={handleClickBook}
                onMouseEnter={handleBookMouseEnter}
                onMouseLeave={handleBookMouseLeave}
                style={{
                  transform: `translate(${layoutTransform.x}px, ${layoutTransform.y}px) scale(${layoutTransform.scale})`
                }}
              >
                <div
                  className="book-rotator"
                  style={{
                    transform: `perspective(1000px) rotateY(${transform.rotateY}deg) rotateX(${transform.rotateX}deg) rotateZ(${getRotateZ()}deg)`,
                    transition: frame >= 3 ? 'none' : 'transform 0.1s ease-out'
                  }}
                >
                  {/* 书籍打开/切换动画帧 */}
                  {[0, 1, 2, 3, 4].map((index) => (
                    <img
                      key={`book-${index}`}
                      src={`/book-${index}.webp`}
                      alt={`Book Frame ${index}`}
                      className={`book-image-layer ${index === frame && appState !== APP_STATES.SWITCHING ? 'visible' : ''}`}
                    />
                  ))}

                  {/* 翻页动画帧（SWITCHING 状态） - 预渲染所有帧以避免闪烁 */}
                  {[0, 1, 2, 3, 4].map((index) => (
                    <img
                      key={`fanye-${index}`}
                      src={`/fanye-${index}.webp`}
                      alt={`Flip Frame ${index}`}
                      className={`flip-animation-layer ${appState === APP_STATES.SWITCHING && frame === index ? 'visible' : ''}`}
                    />
                  ))}

                  {/* 书籍背景（内容打开时显示） */}
                  <div
                    className={`book-content-bg ${shouldShowContent() ? 'visible' : ''}`}
                  />

                  {/* 当前内容的封面 */}
                  {getCurrentContent() && (
                    <img
                      src={getCurrentContent().coverImage}
                      alt="Book Cover"
                      className={`book-content-image ${shouldShowContent() ? 'visible' : ''}`}
                      onClick={handleViewContent}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>

                {/* 只在 BOOK 状态显示导航按钮 */}
                {appState === APP_STATES.BOOK && contents.length > 1 && (
                  <div className="navigation-buttons">
                    <button
                      className="nav-button nav-prev transparent-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSwitchContent('prev')
                      }}
                      aria-label="Previous article"
                    />
                    <button
                      className="nav-button nav-next transparent-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSwitchContent('next')
                      }}
                      aria-label="Next article"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 翻页加载指示器 */}
          {nextPageLoading && appState === APP_STATES.BOOK && (
            <div className="page-loading-indicator">
              <div className="loading-spinner"></div>
              <span>加载中...</span>
            </div>
          )}

          {/* 错误提示 */}
          {loadError && (
            <div className="error-toast">
              {loadError}
            </div>
          )}

          {/* 内容详情覆盖层（内联组件） */}
          {appState === APP_STATES.CONTENT && getCurrentContent() && (() => {
            const ContentComponent = getCurrentContent().Component
            return (
              <div className="back-view-overlay active" onClick={handleCloseContent}>
                <div
                  className="iframe-container visible"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="content-scroll-area">
                    <ContentComponent onBack={handleCloseContent} />
                  </div>
                </div>
              </div>
            )
          })()}

          {/* 背景加载中的浮动 loading */}
          {renderProgressLoading()}
        </>
      )}
    </div>
  )
}

export default HomePage
