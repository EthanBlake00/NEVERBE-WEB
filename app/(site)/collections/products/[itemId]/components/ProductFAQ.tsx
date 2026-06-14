import React from "react";

const ProductFAQ = () => {
  return (
    <section className="bg-surface-2 py-6 md:py-20 mt-6 md:mt-16 border-t border-default w-full">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16">
        <h3 className="text-xl font-display font-black uppercase tracking-tighter text-primary-dark mb-6 md:mb-12">
          The Neverbe Standard
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-40">
          <div className="space-y-4">
            <h4 className="text-sm font-display font-black uppercase tracking-tight text-primary-dark">
              Secure COD Island-wide
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              We offer Cash on Delivery across all 25 districts in Sri Lanka.
              Pay only when your shoes, clothing, or accessories arrive at your
              door.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-display font-black uppercase tracking-tight text-primary-dark">
              Premium Quality Guaranteed
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              Every product — from sneakers and apparel to activewear — is built
              to deliver the perfect balance of iconic design, comfort, and
              durability.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-display font-black uppercase tracking-tight text-primary-dark">
              7-Day Size Exchange
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              Not the perfect fit? We accept free size exchanges within 7 days
              of delivery on all shoes and clothing items.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFAQ;
