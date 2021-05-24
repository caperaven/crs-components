import {EventDispatcher} from "./../../src/core/EventDispatcher.js";

export class DragControls extends EventDispatcher {
	constructor(objects, camera, domElement, isReadyCallback) {
		super();
		this._objects = objects;
		this._camera = camera;
		this._domElement = domElement;

		this._onPointerMoveHandler = this._onPointerMove.bind(this);
		this._onPointerDownHandler = this._onPointerDown.bind(this);
		this._onPointerCancelHandler = this._onPointerCancel.bind(this);
		this._onPointerCancelHandler = this._onPointerCancel.bind(this);
		this._onTouchMoveHandler = this._onTouchMove.bind(this);
		this._onTouchStartHandler = this._onTouchStart.bind(this);
		this._onTouchEndHandler = this._onTouchEnd.bind(this);

		this.initialize().then(() =>
			requestAnimationFrame(() => {
				this.rect = this._domElement.getBoundingClientRect();
				this.enabled = true;
				this.transformGroup = false;
				this.activate();
				isReadyCallback && isReadyCallback();
			}));
	}

	async initialize() {
		const Plane = await crs.getThreePrototype("Plane");
		const Raycaster = await crs.getThreePrototype("Raycaster");
		const Vector2 = await crs.getThreePrototype("Vector2");
		const Vector3 = await crs.getThreePrototype("Vector3");
		const Matrix4 = await crs.getThreePrototype("Matrix4");

		this._plane = new Plane();
		this._raycaster = new Raycaster();

		this._mouse = new Vector2();
		this._offset = new Vector3();
		this._intersection = new Vector3();
		this._worldPosition = new Vector3();
		this._inverseMatrix = new Matrix4();
		this._intersections = [];

		this._selected = null;
		this._hovered = null;
		this.scope = this;
	}

	dispose() {
		this.deactivate();

		delete this._objects;
		delete this._camera;
		delete this._domElement;
		this._plane = null;
		this._raycaster = null;
		this._mouse = null;
		this._offset = null;
		this._intersection = null;
		this._worldPosition = null;
		this._inverseMatrix = null;
		this._intersections = null;

		this._selected = null;
		this._hovered = null;
		this.scope = this;

		this._onPointerMoveHandler = null;
		this._onPointerDownHandler = null;
		this._onPointerCancelHandler = null;
		this._onPointerCancelHandler = null;
		this._onTouchMoveHandler = null;
		this._onTouchStartHandler = null;
		this._onTouchEndHandler = null;
	}

	activate() {
		this._domElement.addEventListener('pointermove', this._onPointerMoveHandler);
		this._domElement.addEventListener('pointerdown', this._onPointerDownHandler);
		this._domElement.addEventListener('pointerup', this._onPointerCancelHandler);
		this._domElement.addEventListener('pointerleave', this._onPointerCancelHandler);
		this._domElement.addEventListener('touchmove', this._onTouchMoveHandler);
		this._domElement.addEventListener('touchstart', this._onTouchStartHandler);
		this._domElement.addEventListener('touchend', this._onTouchEndHandler);
	}

	deactivate() {
		this._domElement.removeEventListener('pointermove', this._onPointerMoveHandler);
		this._domElement.removeEventListener('pointerdown', this._onPointerDownHandler);
		this._domElement.removeEventListener('pointerup', this._onPointerCancelHandler);
		this._domElement.removeEventListener('pointerleave', this._onPointerCancelHandler);
		this._domElement.removeEventListener('touchmove', this._onTouchMoveHandler);
		this._domElement.removeEventListener('touchstart', this._onTouchStartHandler);
		this._domElement.removeEventListener('touchend', this._onTouchEndHandler);
		this._domElement.style.cursor = '';
	}

	_setMouseFromEvent(event) {
		this._mouse.x = ((event.clientX - this.rect.left) / this.rect.width) * 2 - 1;
		this._mouse.y = - ((event.clientY - this.rect.top) / this.rect.height) * 2 + 1;
	}

	_onPointerMove(event) {
		event.preventDefault();

		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				{
					this._onMouseMove(event);
					break;
				}
		}
	}

	_onMouseMove(event) {
		this._setMouseFromEvent(event);

		this._raycaster.setFromCamera(this._mouse, this._camera);

		if (this._selected && this.scope.enabled ) {
			if (this._raycaster.ray.intersectPlane(this._plane, this._intersection)) {
				this._selected.position.copy(this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix));
			}

			this.scope.dispatchEvent({type: 'drag', object: this._selected});
			return;
		}

		this._intersections.length = 0;

		this._raycaster.setFromCamera(this._mouse, this._camera);
		this._raycaster.intersectObjects(this._objects, true, this._intersections);

		if (this._intersections.length > 0) {
			const object = this._intersections[0].object;

			this._plane.setFromNormalAndCoplanarPoint(this._camera.getWorldDirection(this._plane.normal ), this._worldPosition.setFromMatrixPosition(object.matrixWorld));

			if (this._hovered !== object) {
				this.scope.dispatchEvent( {type: 'hoveron', object: object});
				this._domElement.style.cursor = 'pointer';
				this._hovered = object;
			}

		} else if (this._hovered !== null ) {
			this.scope.dispatchEvent({type: 'hoveroff', object: this._hovered});
			this._domElement.style.cursor = 'auto';
			this._hovered = null;
		}
	}

	_onPointerDown(event) {
		event.preventDefault();

		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				this._onMouseDown( event );
				break;
		}
	}

	_onMouseDown(event) {
		event.preventDefault();

		this._intersections.length = 0;

		this._raycaster.setFromCamera(this._mouse, this._camera);
		this._raycaster.intersectObjects(this._objects, true, this._intersections);

		if (this._intersections.length > 0) {

			this._selected = (this.scope.transformGroup === true ) ? this._objects[0] : this._intersections[0].object;

			if (this._raycaster.ray.intersectPlane(this._plane, this._intersection)) {
				this._inverseMatrix.copy(this._selected.parent.matrixWorld ).invert();
				this._offset.copy(this._intersection ).sub(this._worldPosition.setFromMatrixPosition(this._selected.matrixWorld));
			}

			this._domElement.style.cursor = 'move';
			this.scope.dispatchEvent( { type: 'dragstart', object: this._selected});
		}
	}

	_onPointerCancel(event) {
		event.preventDefault();

		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				this._onMouseCancel( event );
				break;
		}
	}

	_onMouseCancel(event) {
		event.preventDefault();

		if (this._selected) {
			this.scope.dispatchEvent( {type: 'dragend', object: this._selected});
			this._selected = null;
		}

		this._domElement.style.cursor = this._hovered ? 'pointer' : 'auto';
	}

	_onTouchMove(event) {
		event.preventDefault();
		event = event.changedTouches[0];

		this._setMouseFromEvent(event);
		this._raycaster.setFromCamera(this._mouse, this._camera);

		if (this._selected && this.scope.enabled ) {
			if (this._raycaster.ray.intersectPlane(this._plane, this._intersection)) {
				this._selected.position.copy(this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix));
			}
			this.scope.dispatchEvent({type: 'drag', object: this._selected});
			return;
		}
	}

	_onTouchStart(event) {
		event.preventDefault();
		event = event.changedTouches[0];

		this._setMouseFromEvent(event);
		this._intersections.length = 0;
		this._raycaster.setFromCamera(this._mouse, this._camera);
		this._raycaster.intersectObjects(this._objects, true, this._intersections);

		if (this._intersections.length > 0) {
			this._selected = (this.scope.transformGroup === true ) ? this._objects[0] : this._intersections[0].object;
			this._plane.setFromNormalAndCoplanarPoint(this._camera.getWorldDirection(this._plane.normal ), this._worldPosition.setFromMatrixPosition(this._selected.matrixWorld));

			if (this._raycaster.ray.intersectPlane(this._plane, this._intersection)) {
				this._inverseMatrix.copy(this._selected.parent.matrixWorld ).invert();
				this._offset.copy(this._intersection).sub(this._worldPosition.setFromMatrixPosition(this._selected.matrixWorld));
			}

			this._domElement.style.cursor = 'move';
			this.scope.dispatchEvent({ type: 'dragstart', object: this._selected});
		}
	}

	_onTouchEnd(event) {
		event.preventDefault();

		if (this._selected ) {
			this.scope.dispatchEvent({type: 'dragend', object: this._selected});
			this._selected = null;
		}

		this._domElement.style.cursor = 'auto';
	}
}