

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalButtonProps {
  type: 'one-time' | 'subscription';
  amount?: string;
  description?: string;
  planId?: string;
  onSuccess: (details?: any) => void;
  disabled?: boolean;
}

const PayPalButton: React.FC<PayPalButtonProps> = (props) => {
  const { disabled } = props;
  const paypalRef = useRef<HTMLDivElement>(null);
  
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  useEffect(() => {
    if (!window.paypal || !window.paypal.Buttons || !paypalRef.current) {
      return;
    }

    let button: any = null;

    try {
      const buttonOptions = {
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        onClick: (_: any, actions: any) => {
          const currentProps = propsRef.current;
          if (currentProps.disabled) {
            return actions.reject();
          }
          if (currentProps.type === 'one-time') {
              const amountValue = parseFloat(currentProps.amount || '');
              if (isNaN(amountValue) || amountValue <= 0) {
                  console.error("Invalid amount for PayPal transaction:", currentProps.amount);
                  alert("Please enter a valid amount to proceed.");
                  return actions.reject();
              }
          }
           if (currentProps.type === 'subscription') {
              if (!currentProps.planId || currentProps.planId === 'P-YOUR_PREMIUM_PLAN_ID') {
                  const errorMsg = "PayPal subscription is not configured. Please contact support.";
                  console.error(errorMsg);
                  alert(errorMsg);
                  return actions.reject();
              }
          }
          return actions.resolve();
        },
        onApprove: (data: any, _: any) => {
          console.log("PayPal payment successful:", data);
          propsRef.current.onSuccess(data);
        },
        onError: (err: any) => {
          console.error('PayPal Checkout Error:', err.message);
          alert('An error occurred during the PayPal transaction. Please try again.');
        },
      };

      if (propsRef.current.type === 'subscription') {
        Object.assign(buttonOptions, {
          createSubscription: (_: any, actions: any) => {
            return actions.subscription.create({ 'plan_id': propsRef.current.planId });
          }
        });
      } else { // one-time payment
        Object.assign(buttonOptions, {
          createOrder: (_: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                description: propsRef.current.description || 'One-time payment',
                amount: {
                  value: propsRef.current.amount, // No more fallback
                  currency_code: 'USD'
                }
              }]
            });
          }
        });
      }
    
      button = window.paypal.Buttons(buttonOptions);

      if (button.isEligible() && paypalRef.current) {
          paypalRef.current.innerHTML = ''; // Ensure container is empty before rendering
          button.render(paypalRef.current).catch((err: any) => {
              console.error("Failed to render PayPal button:", err.message);
          });
      }

    } catch(err: any) {
        console.error("Error initializing PayPal Buttons:", err.message);
    }
    
    return () => {
      if (button && typeof button.close === 'function') {
        button.close().catch((err: any) => {
            console.error("PayPal button failed to close:", err.message);
        });
      }
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div ref={paypalRef} />
    </div>
  );
};

export default PayPalButton;
