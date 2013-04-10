Xylose.AnimatedEntity = function (game, modelPath, texturePath, scale, animations, defaultAnimation) {
	Xylose.Entity.call(this, game, modelPath, texturePath, scale);
	
	this.animations = animations;
	this.defaultAnimation = defaultAnimation;
	
	this.transitionFrames = 15;
};

Xylose.AnimatedEntity.prototype = Object.create(Xylose.Entity.prototype);

Xylose.AnimatedEntity.prototype.loadContent = function (callback) {
	var scope = this;
	Xylose.Entity.prototype.loadContent.call(this, function () {
		scope.meshBody.autoCreateAnimations(6);
		scope.setAnimation(scope.defaultAnimation);
		
		callback();
	});
};

Xylose.AnimatedEntity.prototype.draw = function (delta) {
	var mix = 1;

	if (this.blendCounter > 0) {
		mix = (this.transitionFrames - this.blendCounter) / this.transitionFrames;
		this.blendCounter -= 1;
	}

	if (this.meshBody) {
		this.meshBody.update(delta);

		this.meshBody.setAnimationWeight(this.activeAnimation, mix);
		this.meshBody.setAnimationWeight(this.oldAnimation, 1 - mix);
	}
};

Xylose.AnimatedEntity.prototype.setAnimation = function (animationName) {
	if (this.meshBody && this.activeAnimation !== animationName) {
		this.meshBody.setAnimationWeight(animationName, 0);	
		this.meshBody.playAnimation(animationName);
		
		this.oldAnimation = this.activeAnimation;
		this.activeAnimation = animationName;

		this.blendCounter = this.transitionFrames;
	}
};