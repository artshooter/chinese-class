import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ClassroomScene = ({ onBookClick, isAnimating }) => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const bookRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 初始化场景
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0xd4a574)

    // 相机
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 5)
    cameraRef.current = camera

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // 创建书籍对象
    const bookGeometry = new THREE.BoxGeometry(2, 3, 0.2)
    const bookMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      roughness: 0.3,
      metalness: 0.1,
    })
    const book = new THREE.Mesh(bookGeometry, bookMaterial)
    book.castShadow = true
    book.receiveShadow = true
    book.position.z = 0
    bookRef.current = book
    scene.add(book)

    // 添加光标指示
    const canvas = renderer.domElement
    canvas.style.cursor = 'pointer'

    // 动画循环
    let animationFrameId
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // 微晃动相机
      if (!isAnimating) {
        camera.position.y = Math.sin(Date.now() * 0.001) * 0.1
      }

      // 书籍微旋转
      if (!isAnimating) {
        book.rotation.z = Math.sin(Date.now() * 0.002) * 0.02
      }

      renderer.render(scene, camera)
    }
    animate()

    // 点击事件
    const handleClick = () => {
      if (!isAnimating) {
        onBookClick?.()
      }
    }
    canvas.addEventListener('click', handleClick)

    // 窗口大小调整
    const handleResize = () => {
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('click', handleClick)
      cancelAnimationFrame(animationFrameId)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [onBookClick, isAnimating])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default ClassroomScene
