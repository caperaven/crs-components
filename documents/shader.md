https://codepen.io/RafaelMilewski/pen/bvPQJy

const resolution = new THREE.Vector3(this.width, this.height, window.devicePixelRatio)

this.bufferA = new BufferShader(BUFFER_A_FRAG, {
    iFrame: { value: 0 },
    iResolution: { value: resolution },
    iMouse: { value: this.mousePosition },
    iChannel0: { value: null },
    iChannel1: { value: null }
})

this.bufferB = new BufferShader(BUFFER_B_FRAG, {
    iFrame: { value: 0 },
    iResolution: { value: resolution },
    iMouse: { value: this.mousePosition },
    iChannel0: { value: null }
})

this.bufferImage = new BufferShader(BUFFER_FINAL_FRAG, {
    iResolution: { value: resolution },
    iMouse: { value: this.mousePosition },
    iChannel0: { value: channel0 },
    iChannel1: { value: null }
})

private targetA = new BufferManager(this.renderer, { width: this.width, height: this.height })
private targetB = new BufferManager(this.renderer, { width: this.width, height: this.height })
private targetC = new BufferManager(this.renderer, { width: this.width, height: this.height })
